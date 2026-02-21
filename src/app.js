import "./style.css";
import EthereumProvider from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";

const TOKEN_SYMBOL = "WESEE";
const TOTAL_SUPPLY = 50000;
const PRICE_USDT = 1;
const MIN_BUY_USDT = 1;

const WC_PROJECT_ID = "6cd9185e9e8517c636ebaff85041eaf4";

const BSC = {
  chainId: 56,
  chainIdHex: "0x38",
  chainName: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"]
};

let sold = 0;

const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");

const usdtInput = document.getElementById("usdtAmount");
const tokenOutput = document.getElementById("weseeAmount");
const buyBtn = document.getElementById("buyBtn");

const remainingText = document.getElementById("remainingText");

const statusBar = document.getElementById("statusBar");
const statusBarText = document.getElementById("statusBarText");
const switchNetworkBtn = document.getElementById("switchNetworkBtn");

let externalProvider = null;
let web3Provider = null;

let wcProvider = null;
let wcInitPromise = null;
let wcWired = false;

const shortAddr = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const remaining = () => Math.max(0, TOTAL_SUPPLY - sold);

function setStatusState(state, msg) {
  if (statusBar) statusBar.dataset.state = state;
  if (statusBarText) statusBarText.textContent = msg;
}

function setConnectedUI(addr) {
  if (connectBtn) connectBtn.textContent = shortAddr(addr);
  if (disconnectBtn) disconnectBtn.style.display = "inline-block";
}

function setDisconnectedUI() {
  if (connectBtn) connectBtn.textContent = "Connect Wallet";
  if (disconnectBtn) disconnectBtn.style.display = "none";
}

function recalcSale() {
  const usdt = Number(usdtInput?.value || 0);
  if (tokenOutput) tokenOutput.value = usdt ? String(usdt / PRICE_USDT) : "";
  if (remainingText) remainingText.textContent = `${remaining()} ${TOKEN_SYMBOL}`;
  if (buyBtn) buyBtn.disabled = usdt < MIN_BUY_USDT || usdt > remaining();
}

function chooseWallet() {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "wallet-modal-overlay";

    const box = document.createElement("div");
    box.className = "wallet-modal";

    box.innerHTML = `
      <h3>Connect Wallet</h3>
      <div class="wallet-btn-row">
        <button id="mm" class="wallet-btn">MetaMask</button>
        <button id="trust" class="wallet-btn">Trust Wallet</button>
      </div>
      <div class="wallet-btn-row">
        <button id="wc" class="wallet-btn wc">WalletConnect</button>
      </div>
      <div class="wallet-btn-row">
        <button id="cancel" class="wallet-btn cancel">Cancel</button>
      </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const cleanup = () => overlay.remove();

    box.querySelector("#mm").onclick = () => { cleanup(); resolve("metamask"); };
    box.querySelector("#trust").onclick = () => { cleanup(); resolve("trust"); };
    box.querySelector("#wc").onclick = () => { cleanup(); resolve("walletconnect"); };
    box.querySelector("#cancel").onclick = () => { cleanup(); resolve(null); };

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) { cleanup(); resolve(null); }
    });
  });
}

function getInjected(kind) {
  const eth = window.ethereum;
  if (!eth) return null;
  const list = eth.providers ?? [eth];

  if (kind === "metamask") return list.find(p => p.isMetaMask) ?? null;
  if (kind === "trust") return list.find(p => p.isTrust || p.isTrustWallet) ?? null;

  return null;
}

async function switchToBSC() {
  if (!externalProvider?.request) {
    setStatusState("wrong_network", "Please switch to BSC in your wallet");
    return false;
  }

  try {
    await externalProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BSC.chainIdHex }]
    });
    return true;
  } catch (e) {
    if (e?.code === 4902) {
      try {
        await externalProvider.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: BSC.chainIdHex,
            chainName: BSC.chainName,
            nativeCurrency: BSC.nativeCurrency,
            rpcUrls: BSC.rpcUrls,
            blockExplorerUrls: BSC.blockExplorerUrls
          }]
        });

        await externalProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BSC.chainIdHex }]
        });
        return true;
      } catch (_) {
        setStatusState("wrong_network", "Please add/switch to BSC manually in your wallet");
        return false;
      }
    }

    setStatusState("wrong_network", "Please switch to BSC in your wallet");
    return false;
  }
}

async function updateNetworkStatus() {
  if (!web3Provider) return;

  try {
    const net = await web3Provider.getNetwork();
    if (net.chainId !== BSC.chainId) {
      setStatusState("wrong_network", "Please switch to BSC");
      if (switchNetworkBtn) switchNetworkBtn.style.display = "inline-flex";
    } else {
      setStatusState("connected", "Wallet connected ✅");
      if (switchNetworkBtn) switchNetworkBtn.style.display = "none";
    }
  } catch (_) {}
}

async function connectInjected(kind) {
  const injected = getInjected(kind);
  if (!injected) {
    setStatusState("disconnected", `${kind === "trust" ? "Trust Wallet" : "MetaMask"} not detected`);
    return;
  }

  externalProvider = injected;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  try {
    await externalProvider.request({ method: "eth_requestAccounts" });
  } catch (_) {
    setStatusState("disconnected", "Connection rejected");
    return;
  }

  const addr = await web3Provider.getSigner().getAddress();
  setConnectedUI(addr);
  await updateNetworkStatus();

  externalProvider.on?.("accountsChanged", async (accounts) => {
    if (!accounts || !accounts[0]) {
      await disconnectWallet(true);
      return;
    }
    setConnectedUI(accounts[0]);
    await updateNetworkStatus();
  });

  externalProvider.on?.("chainChanged", async () => {
    await updateNetworkStatus();
  });
}

async function initWCProvider() {
  if (wcProvider) return wcProvider;
  if (wcInitPromise) return wcInitPromise;

  wcInitPromise = EthereumProvider.init({
    projectId: WC_PROJECT_ID,
    chains: [BSC.chainId],
    rpcMap: { [BSC.chainId]: BSC.rpcUrls[0] },
    showQrModal: true
  }).then((p) => {
    wcProvider = p;
    return p;
  }).catch((e) => {
    wcInitPromise = null;
    throw e;
  });

  return wcInitPromise;
}

function wireWCEventsOnce() {
  if (!wcProvider?.on) return;
  if (wcWired) return;
  wcWired = true;

  wcProvider.on("accountsChanged", async (accounts) => {
    if (!accounts || !accounts[0]) {
      await disconnectWallet(false);
      return;
    }
    setConnectedUI(accounts[0]);
    await updateNetworkStatus();
  });

  wcProvider.on("chainChanged", async () => {
    await updateNetworkStatus();
  });

  wcProvider.on("disconnect", async () => {
    await disconnectWallet(false);
  });
}

async function connectWalletConnect() {
  try {
    await initWCProvider();
    wireWCEventsOnce();
    await wcProvider.connect();
  } catch (e) {
    const msg = String(e?.message || e || "");
    if (msg.toLowerCase().includes("origin")) {
      setStatusState("disconnected", "WalletConnect blocked: origin not allowed");
    } else {
      setStatusState("disconnected", "WalletConnect failed. Try Private tab / hard refresh.");
    }
    return;
  }

  externalProvider = wcProvider;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  const addr = wcProvider.accounts?.[0] || null;
  if (addr) setConnectedUI(addr);

  await updateNetworkStatus();
}

async function restoreWalletConnectSession() {
  try {
    await initWCProvider();
    wireWCEventsOnce();

    const hasSession = !!wcProvider?.session;
    const hasAccounts = Array.isArray(wcProvider?.accounts) && wcProvider.accounts.length > 0;

    if (!hasSession && !hasAccounts) return;

    try { await wcProvider.enable(); } catch (_) {}

    externalProvider = wcProvider;
    web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

    const addr = wcProvider.accounts?.[0] || await web3Provider.getSigner().getAddress();
    setConnectedUI(addr);
    await updateNetworkStatus();
  } catch (_) {
    try { await wcProvider?.disconnect?.(); } catch (_) {}
  }
}

async function disconnectWallet(clearWC = true) {
  try {
    if (clearWC && wcProvider?.disconnect) await wcProvider.disconnect();
  } catch (_) {}

  externalProvider = null;
  web3Provider = null;

  setDisconnectedUI();
  if (switchNetworkBtn) switchNetworkBtn.style.display = "none";
  setStatusState("disconnected", "Connect your wallet");
}

connectBtn?.addEventListener("click", async () => {
  const choice = await chooseWallet();
  if (!choice) return;

  if (choice === "metamask") await connectInjected("metamask");
  if (choice === "trust") await connectInjected("trust");
  if (choice === "walletconnect") await connectWalletConnect();
});

disconnectBtn?.addEventListener("click", () => disconnectWallet(true));

switchNetworkBtn?.addEventListener("click", async () => {
  const ok = await switchToBSC();
  if (ok) await updateNetworkStatus();
});

usdtInput?.addEventListener("input", recalcSale);

buyBtn?.addEventListener("click", () => {
  const usdt = Number(usdtInput?.value || 0);
  if (usdt < MIN_BUY_USDT || usdt > remaining()) return;

  sold += usdt;

  if (usdtInput) usdtInput.value = "";
  if (tokenOutput) tokenOutput.value = "";

  recalcSale();
  setStatusState("connected", "Demo purchase successful (UI only) ✅");
});

recalcSale();
setDisconnectedUI();
setStatusState("disconnected", "Connect your wallet");
if (switchNetworkBtn) switchNetworkBtn.style.display = "none";
restoreWalletConnectSession();
