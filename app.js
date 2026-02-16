import EthereumProvider from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";

const TOKEN_SYMBOL = "WESEE";
const TOTAL_SUPPLY = 50000;
const PRICE_USDT = 1;
const MIN_BUY_USDT = 1;

const WC_PROJECT_ID = "6cd9185e9e8517c636ebaff85041eaf4";

const BSC = {
  chainId: 56,
  rpc: "https://bsc-dataseed.binance.org/"
};

let sold = 0;

const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");

const usdtInput = document.getElementById("usdtAmount");
const tokenOutput = document.getElementById("weseeAmount");
const buyBtn = document.getElementById("buyBtn");

const remainingText = document.getElementById("remainingText");
const statusText = document.getElementById("statusText");

let externalProvider = null;
let web3Provider = null;
let wcProvider = null;

const shortAddr = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const remaining = () => Math.max(0, TOTAL_SUPPLY - sold);

function setStatus(msg, ok = true) {
  if (!statusText) return;
  statusText.textContent = msg;
  statusText.style.color = ok ? "#7CFF9B" : "#FF6B6B";
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

async function updateNetworkStatus() {
  try {
    if (!web3Provider) return;
    const net = await web3Provider.getNetwork();
    if (net.chainId !== BSC.chainId) setStatus("Please switch to BSC", false);
    else setStatus("Wallet connected ✅", true);
  } catch (_) {}
}

async function connectInjected(kind) {
  const injected = getInjected(kind);
  if (!injected) {
    setStatus(`${kind === "trust" ? "Trust Wallet" : "MetaMask"} not detected`, false);
    return;
  }

  externalProvider = injected;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  try {
    await externalProvider.request({ method: "eth_requestAccounts" });
  } catch (_) {
    setStatus("Connection rejected", false);
    return;
  }

  const addr = await web3Provider.getSigner().getAddress();
  setConnectedUI(addr);
  await updateNetworkStatus();

  externalProvider.on?.("accountsChanged", async (accounts) => {
    if (!accounts || !accounts[0]) {
      await disconnectWallet();
      return;
    }
    setConnectedUI(accounts[0]);
    await updateNetworkStatus();
  });

  externalProvider.on?.("chainChanged", async () => {
    await updateNetworkStatus();
  });
}

async function initWCProvider(showQrModal) {
  wcProvider = await EthereumProvider.init({
    projectId: WC_PROJECT_ID,
    chains: [BSC.chainId],
    rpcMap: { [BSC.chainId]: BSC.rpc },
    showQrModal
  });
  return wcProvider;
}

async function connectWalletConnect() {
  try {
    await initWCProvider(true);
    await wcProvider.connect();
  } catch (e) {
    const msg = (e && (e.message || e.toString())) || "WalletConnect error";
    if (String(msg).toLowerCase().includes("origin")) {
      setStatus("WalletConnect blocked: origin not allowed (Allowed Origins)", false);
    } else {
      setStatus("WalletConnect failed. Try Private tab / hard refresh.", false);
    }
    return;
  }

  externalProvider = wcProvider;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  const addr = await web3Provider.getSigner().getAddress();
  setConnectedUI(addr);
  await updateNetworkStatus();

  wcProvider.on?.("accountsChanged", async (accounts) => {
    if (!accounts || !accounts[0]) {
      await disconnectWallet();
      return;
    }
    setConnectedUI(accounts[0]);
    await updateNetworkStatus();
  });

  wcProvider.on?.("chainChanged", async () => {
    await updateNetworkStatus();
  });

  wcProvider.on?.("disconnect", async () => {
    await disconnectWallet();
  });
}

async function restoreWalletConnectSession() {
  try {
    await initWCProvider(false);
    const hasSession = !!wcProvider?.session;
    const hasAccounts = Array.isArray(wcProvider?.accounts) && wcProvider.accounts.length > 0;

    if (!hasSession && !hasAccounts) return;

    try { await wcProvider.enable(); } catch (_) {}

    externalProvider = wcProvider;
    web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

    const accounts = wcProvider.accounts || [];
    const addr = accounts[0] || await web3Provider.getSigner().getAddress();

    setConnectedUI(addr);
    await updateNetworkStatus();

    wcProvider.on?.("accountsChanged", async (accts) => {
      if (!accts || !accts[0]) {
        await disconnectWallet();
        return;
      }
      setConnectedUI(accts[0]);
      await updateNetworkStatus();
    });

    wcProvider.on?.("chainChanged", async () => {
      await updateNetworkStatus();
    });

    wcProvider.on?.("disconnect", async () => {
      await disconnectWallet();
    });
  } catch (_) {}
}

async function disconnectWallet() {
  try {
    if (wcProvider?.disconnect) await wcProvider.disconnect();
  } catch (_) {}

  wcProvider = null;
  externalProvider = null;
  web3Provider = null;

  setDisconnectedUI();
  setStatus("Disconnected");
}

connectBtn?.addEventListener("click", async () => {
  const choice = await chooseWallet();
  if (!choice) return;

  if (choice === "metamask") await connectInjected("metamask");
  if (choice === "trust") await connectInjected("trust");
  if (choice === "walletconnect") await connectWalletConnect();
});

disconnectBtn?.addEventListener("click", () => disconnectWallet());

usdtInput?.addEventListener("input", recalcSale);

buyBtn?.addEventListener("click", () => {
  const usdt = Number(usdtInput?.value || 0);
  if (usdt < MIN_BUY_USDT || usdt > remaining()) return;

  sold += usdt;

  if (usdtInput) usdtInput.value = "";
  if (tokenOutput) tokenOutput.value = "";

  recalcSale();
  setStatus("Demo purchase successful (UI only) ✅", true);
});

recalcSale();
setStatus("Ready", true);
setDisconnectedUI();
restoreWalletConnectSession();
