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
const switchBtn = document.getElementById("switchBtn");

const usdtInput = document.getElementById("usdtAmount");
const tokenOutput = document.getElementById("weseeAmount");
const buyBtn = document.getElementById("buyBtn");
const maxBtn = document.getElementById("maxBtn");

const remainingText = document.getElementById("remainingText");
const soldText = document.getElementById("soldText");
const statusText = document.getElementById("statusText");
const maxHint = document.getElementById("maxHint");
const yearEl = document.getElementById("year");

let externalProvider = null;
let web3Provider = null;

let wcProvider = null;
let wcInitPromise = null;
let wcEventsWired = false;

const toastRoot = document.getElementById("toastRoot");
let toastSeq = 0;

const shortAddr = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const remaining = () => Math.max(0, TOTAL_SUPPLY - sold);

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

function toast(message, type = "bad", ms = 3400) {
  if (!toastRoot) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.setAttribute("role", "status");
  el.innerHTML = `
    <div class="toast-dot"></div>
    <div class="toast-text">${String(message || "")}</div>
    <button class="toast-close" type="button" aria-label="Close">×</button>
  `;
  const close = () => {
    if (!el.isConnected) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(-4px)";
    setTimeout(() => el.remove(), 140);
  };
  el.querySelector(".toast-close").addEventListener("click", close);
  toastRoot.appendChild(el);
  setTimeout(close, ms);
  toastSeq++;
}

function setStatus(msg, kind = "neutral") {
  if (!statusText) return;
  statusText.textContent = msg;
  statusText.classList.remove("good", "bad", "neutral");
  statusText.classList.add(kind);
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

function recalcSale() {
  const usdt = Number(usdtInput?.value || 0);
  const out = usdt ? usdt / PRICE_USDT : 0;

  if (tokenOutput) tokenOutput.value = usdt ? String(out) : "";
  if (remainingText) remainingText.textContent = `${remaining()} ${TOKEN_SYMBOL}`;
  if (soldText) soldText.textContent = `${sold} ${TOKEN_SYMBOL}`;
  if (maxHint) maxHint.textContent = String(remaining());

  const canBuy = !!web3Provider && usdt >= MIN_BUY_USDT && usdt <= remaining();
  if (buyBtn) buyBtn.disabled = !canBuy;
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
    toast("Cannot switch network automatically. Please switch to BSC in your wallet.", "bad");
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
      } catch {
        toast("Please add/switch to BSC manually in your wallet.", "bad");
        return false;
      }
    }

    toast("Please switch to BSC in your wallet.", "bad");
    return false;
  }
}

async function updateNetworkStatus() {
  if (!web3Provider) {
    hideSwitchBtn();
    setStatus("Please connect your wallet", "neutral");
    recalcSale();
    return;
  }

  let net;
  try {
    net = await web3Provider.getNetwork();
  } catch {
    hideSwitchBtn();
    setStatus("Please connect your wallet", "neutral");
    recalcSale();
    return;
  }

  if (Number(net.chainId) !== BSC.chainId) {
    showSwitchBtn();
    setStatus("Please switch to BSC", "bad");
    recalcSale();
    return;
  }

  hideSwitchBtn();
  setStatus("Wallet connected ✅", "good");
  recalcSale();
}

async function connectInjected(kind) {
  const injected = getInjected(kind);

  if (!injected) {
    if (isMobile()) {
      toast(`On mobile, open this site inside ${kind === "trust" ? "Trust Wallet" : "MetaMask"} browser or use WalletConnect.`, "bad");
    } else {
      toast(`${kind === "trust" ? "Trust Wallet" : "MetaMask"} is not installed in this browser. Install it or use WalletConnect.`, "bad");
    }
    return;
  }

  externalProvider = injected;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  try {
    await externalProvider.request({ method: "eth_requestAccounts" });
  } catch {
    toast("Connection rejected", "bad");
    return;
  }

  let addr;
  try {
    addr = await web3Provider.getSigner().getAddress();
  } catch {
    toast("Failed to read wallet address", "bad");
    return;
  }

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
    wireWCEvents();

    if (!wcProvider?.session) {
      await wcProvider.connect();
    } else {
      await wcProvider.enable();
    }
  } catch (e) {
    const msg = String(e?.message || e || "");
    if (msg.toLowerCase().includes("origin")) {
      toast("WalletConnect blocked: origin not allowed (Allowed Origins)", "bad");
    } else {
      toast("WalletConnect failed. Try Private tab / hard refresh.", "bad");
    }
    return;
  }

  externalProvider = wcProvider;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  const addr = wcProvider.accounts?.[0];
  if (addr) setConnectedUI(addr);

  await updateNetworkStatus();
}

async function restoreWalletConnectSession() {
  try {
    await initWCProvider();
    wireWCEvents();

    const hasSession = !!wcProvider?.session;
    const hasAccounts = Array.isArray(wcProvider?.accounts) && wcProvider.accounts.length > 0;
    if (!hasSession && !hasAccounts) return;

    try { await wcProvider.enable(); } catch {}

    externalProvider = wcProvider;
    web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

    const addr = wcProvider.accounts?.[0];
    if (addr) setConnectedUI(addr);

    await updateNetworkStatus();
  } catch {
    try { await wcProvider?.disconnect?.(); } catch {}
  }
}

async function disconnectWallet(clearWC = true) {
  try {
    if (clearWC && wcProvider?.disconnect) await wcProvider.disconnect();
  } catch {}

  externalProvider = null;
  web3Provider = null;

  setDisconnectedUI();
  hideSwitchBtn();
  setStatus("Please connect your wallet", "neutral");

  if (buyBtn) buyBtn.disabled = true;
  if (usdtInput) usdtInput.value = "";
  if (tokenOutput) tokenOutput.value = "";

  recalcSale();
}

connectBtn?.addEventListener("click", async () => {
  const choice = await chooseWallet();
  if (!choice) return;

  if (choice === "metamask") await connectInjected("metamask");
  if (choice === "trust") await connectInjected("trust");
  if (choice === "walletconnect") await connectWalletConnect();
});

disconnectBtn?.addEventListener("click", () => disconnectWallet(true));

switchBtn?.addEventListener("click", async () => {
  const ok = await switchToBSC();
  if (ok) await updateNetworkStatus();
});

usdtInput?.addEventListener("input", recalcSale);

maxBtn?.addEventListener("click", () => {
  if (!usdtInput) return;
  usdtInput.value = String(remaining());
  recalcSale();
});

buyBtn?.addEventListener("click", async () => {
  if (!web3Provider) {
    toast("Please connect your wallet first.", "bad");
    return;
  }

  let net;
  try {
    net = await web3Provider.getNetwork();
  } catch {
    toast("Please connect your wallet first.", "bad");
    return;
  }

  if (Number(net.chainId) !== BSC.chainId) {
    toast("Please switch to BSC first.", "bad");
    setStatus("Please switch to BSC", "bad");
    showSwitchBtn();
    return;
  }

  const usdt = Number(usdtInput?.value || 0);

  if (usdt < MIN_BUY_USDT) {
    toast(`Minimum buy is ${MIN_BUY_USDT} USDT.`, "bad");
    return;
  }

  if (usdt > remaining()) {
    toast("Amount exceeds remaining supply.", "bad");
    return;
  }

  toast("Purchase will be enabled after contracts are connected.", "neutral");
});

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

setDisconnectedUI();
hideSwitchBtn();
setStatus("Please connect your wallet", "neutral");
recalcSale();
restoreWalletConnectSession();
