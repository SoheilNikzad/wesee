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
const soldText = document.getElementById("soldText");

const statusText = document.getElementById("statusText");
const statusText2 = document.getElementById("statusText2");
const switchBtn = document.getElementById("switchBtn");

const maxHint = document.getElementById("maxHint");
const maxBtn = document.getElementById("maxBtn");
const yearEl = document.getElementById("year");

let externalProvider = null;
let web3Provider = null;

let wcProvider = null;
let wcInitPromise = null;
let wcEventsWired = false;

let isConnecting = false;

const shortAddr = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const remaining = () => Math.max(0, TOTAL_SUPPLY - sold);

function setStatusClass(el, cls) {
  if (!el) return;
  el.classList.remove("good", "bad", "neutral");
  el.classList.add(cls);
}

function setStatus(msg, type = "neutral") {
  if (statusText) {
    statusText.textContent = msg;
    setStatusClass(statusText, type);
  }
  if (statusText2) {
    statusText2.textContent = msg;
    setStatusClass(statusText2, type);
  }
}

function setConnectedUI(addr) {
  if (connectBtn) connectBtn.textContent = shortAddr(addr);
  if (disconnectBtn) disconnectBtn.style.display = "inline-block";
}

function setDisconnectedUI() {
  if (connectBtn) connectBtn.textContent = "Connect Wallet";
  if (disconnectBtn) disconnectBtn.style.display = "none";
}

function showSwitchBtn() {
  if (switchBtn) switchBtn.style.display = "inline-flex";
}

function hideSwitchBtn() {
  if (switchBtn) switchBtn.style.display = "none";
}

async function switchToBSC() {
  if (!externalProvider?.request) {
    setStatus("Please switch to BSC in your wallet.", "bad");
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
        return false;
      }
    }
    return false;
  }
}

async function updateNetworkStatus() {
  try {
    if (!web3Provider) return;

    const net = await web3Provider.getNetwork();
    if (net.chainId !== BSC.chainId) {
      setStatus("Please switch to BSC", "bad");
      showSwitchBtn();
      return;
    }

    hideSwitchBtn();
    setStatus("Wallet connected ✅", "good");
  } catch (_) {}
}

function recalcSale() {
  const usdt = Number(usdtInput?.value || 0);

  if (tokenOutput) tokenOutput.value = usdt ? String(usdt / PRICE_USDT) : "";
  if (remainingText) remainingText.textContent = `${remaining()} ${TOKEN_SYMBOL}`;
  if (soldText) soldText.textContent = `${sold} ${TOKEN_SYMBOL}`;

  const canBuy = !!web3Provider && usdt >= MIN_BUY_USDT && usdt <= remaining();
  if (buyBtn) buyBtn.disabled = !canBuy;
  if (maxHint) maxHint.textContent = String(remaining());
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

async function connectInjected(kind) {
  const injected = getInjected(kind);
  if (!injected) {
    setStatus(kind === "trust" ? "Trust Wallet not detected" : "MetaMask not detected", "bad");
    return;
  }

  externalProvider = injected;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  try {
    await externalProvider.request({ method: "eth_requestAccounts" });
  } catch (_) {
    setStatus("Connection rejected", "bad");
    return;
  }

  const addr = await web3Provider.getSigner().getAddress();
  setConnectedUI(addr);
  await updateNetworkStatus();
  recalcSale();

  externalProvider.on?.("accountsChanged", async (accounts) => {
    if (!accounts || !accounts[0]) {
      await disconnectWallet();
      return;
    }
    setConnectedUI(accounts[0]);
    await updateNetworkStatus();
    recalcSale();
  });

  externalProvider.on?.("chainChanged", async () => {
    await updateNetworkStatus();
    recalcSale();
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

function wireWCEvents() {
  if (!wcProvider?.on || wcEventsWired) return;
  wcEventsWired = true;

  wcProvider.on("accountsChanged", async (accounts) => {
    if (!accounts || !accounts[0]) {
      await disconnectWallet();
      return;
    }
    setConnectedUI(accounts[0]);
    await updateNetworkStatus();
    recalcSale();
  });

  wcProvider.on("chainChanged", async () => {
    await updateNetworkStatus();
    recalcSale();
  });

  wcProvider.on("disconnect", async () => {
    await disconnectWallet(false);
  });
}

async function connectWalletConnect() {
  try {
    await initWCProvider();
    wireWCEvents();

    if (!wcProvider?.session) {
      await wcProvider.connect();
    } else {
      try { await wcProvider.enable(); } catch (_) {}
    }
  } catch (_) {
    setStatus("WalletConnect failed. Try Private tab / hard refresh.", "bad");
    return;
  }

  externalProvider = wcProvider;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  let addr = null;
  try {
    addr = wcProvider.accounts?.[0] || await web3Provider.getSigner().getAddress();
  } catch (_) {}

  if (addr) setConnectedUI(addr);
  await updateNetworkStatus();
  recalcSale();
}

async function restoreWalletConnectSession() {
  try {
    await initWCProvider();
    wireWCEvents();

    const hasSession = !!wcProvider?.session;
    const hasAccounts = Array.isArray(wcProvider?.accounts) && wcProvider.accounts.length > 0;

    if (!hasSession && !hasAccounts) return;

    try { await wcProvider.enable(); } catch (_) {}

    externalProvider = wcProvider;
    web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

    const addr = wcProvider.accounts?.[0] || await web3Provider.getSigner().getAddress();
    setConnectedUI(addr);
    await updateNetworkStatus();
    recalcSale();
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
  hideSwitchBtn();
  setStatus("Please connect your wallet", "neutral");
  recalcSale();
}

connectBtn?.addEventListener("click", async () => {
  if (isConnecting) return;
  isConnecting = true;

  try {
    const choice = await chooseWallet();
    if (!choice) return;

    if (choice === "metamask") await connectInjected("metamask");
    if (choice === "trust") await connectInjected("trust");
    if (choice === "walletconnect") await connectWalletConnect();
  } finally {
    isConnecting = false;
  }
});

disconnectBtn?.addEventListener("click", () => disconnectWallet(true));

switchBtn?.addEventListener("click", async () => {
  const ok = await switchToBSC();
  if (ok) {
    setStatus("Switched to BSC ✅", "good");
  } else {
    setStatus("Please switch to BSC in your wallet.", "bad");
  }
  await updateNetworkStatus();
  recalcSale();
});

maxBtn?.addEventListener("click", () => {
  if (!usdtInput) return;
  usdtInput.value = String(remaining());
  recalcSale();
});

usdtInput?.addEventListener("input", recalcSale);

buyBtn?.addEventListener("click", () => {
  const usdt = Number(usdtInput?.value || 0);
  if (!web3Provider) return;
  if (usdt < MIN_BUY_USDT || usdt > remaining()) return;

  sold += usdt;

  if (usdtInput) usdtInput.value = "";
  if (tokenOutput) tokenOutput.value = "";

  recalcSale();
  setStatus("Demo purchase successful ✅", "good");
});

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

setDisconnectedUI();
hideSwitchBtn();
setStatus("Please connect your wallet", "neutral");
recalcSale();
restoreWalletConnectSession();
