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
const statusText = document.getElementById("statusText");
const soldText = document.getElementById("soldText");

const maxHint = document.getElementById("maxHint");
const maxBtn = document.getElementById("maxBtn");

const yearEl = document.getElementById("year");

let externalProvider = null;
let web3Provider = null;

let wcProvider = null;
let wcInitPromise = null;

let switchBtn = null;

let activeWalletKind = null;

const shortAddr = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const remaining = () => Math.max(0, TOTAL_SUPPLY - sold);

function setStatus(msg, kind = "neutral") {
  if (!statusText) return;
  statusText.textContent = msg;
  statusText.classList.remove("neutral", "good", "bad");
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

function ensureSwitchBtn() {
  if (!statusText) return null;
  if (switchBtn) return switchBtn;

  const parent = statusText.parentElement || statusText;
  switchBtn = document.createElement("button");
  switchBtn.type = "button";
  switchBtn.textContent = "Switch to BSC";
  switchBtn.style.marginLeft = "12px";
  switchBtn.style.padding = "8px 12px";
  switchBtn.style.borderRadius = "12px";
  switchBtn.style.border = "1px solid rgba(255,255,255,.14)";
  switchBtn.style.background = "rgba(255,255,255,.06)";
  switchBtn.style.color = "rgba(230,237,247,.95)";
  switchBtn.style.fontWeight = "900";
  switchBtn.style.cursor = "pointer";
  switchBtn.style.display = "none";

  switchBtn.addEventListener("click", async () => {
    await switchToBSC();
    await updateNetworkStatus();
    recalcSale();
  });

  if (parent === statusText) {
    statusText.insertAdjacentElement("afterend", switchBtn);
  } else {
    parent.appendChild(switchBtn);
  }

  return switchBtn;
}

function showSwitchBtn() {
  const btn = ensureSwitchBtn();
  if (btn) btn.style.display = "inline-flex";
}

function hideSwitchBtn() {
  if (switchBtn) switchBtn.style.display = "none";
}

async function switchToBSC() {
  if (!externalProvider?.request) {
    setStatus("Please switch to BSC in your wallet.", "bad");
    return;
  }

  try {
    await externalProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BSC.chainIdHex }]
    });
    return;
  } catch (e) {
    const code = e?.code;
    if (code === 4902) {
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

        return;
      } catch (_) {
        setStatus("Please add/switch to BSC manually in your wallet.", "bad");
        return;
      }
    }

    setStatus("Please switch to BSC in your wallet.", "bad");
  }
}

function recalcSale() {
  const usdt = Number(usdtInput?.value || 0);
  const out = usdt ? usdt / PRICE_USDT : 0;

  if (tokenOutput) tokenOutput.value = usdt ? String(out) : "";

  const rem = remaining();
  if (remainingText) remainingText.textContent = `${rem.toLocaleString()} ${TOKEN_SYMBOL}`;
  if (soldText) soldText.textContent = `${sold.toLocaleString()} ${TOKEN_SYMBOL}`;

  if (maxHint) maxHint.textContent = rem.toLocaleString();

  const validAmount = usdt >= MIN_BUY_USDT && usdt <= rem;
  const canBuy = validAmount && isConnected() && isOnBSC();
  if (buyBtn) buyBtn.disabled = !canBuy;
}

function isConnected() {
  return !!web3Provider && !!externalProvider;
}

function isOnBSC() {
  const last = web3Provider?._network?.chainId;
  return last === BSC.chainId;
}

async function updateNetworkStatus() {
  try {
    if (!web3Provider) {
      hideSwitchBtn();
      setStatus("Please connect your wallet", "neutral");
      return;
    }

    const net = await web3Provider.getNetwork();
    if (net.chainId !== BSC.chainId) {
      setStatus("Wrong network: switch to BSC", "bad");
      showSwitchBtn();
    } else {
      hideSwitchBtn();
      setStatus("Ready", "good");
    }
  } catch (_) {}
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
    setStatus(`${kind === "trust" ? "Trust Wallet" : "MetaMask"} not detected`, "bad");
    return;
  }

  activeWalletKind = kind;

  externalProvider = injected;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  setStatus("Connecting…", "neutral");

  try {
    await externalProvider.request({ method: "eth_requestAccounts" });
  } catch (e) {
    const code = e?.code;
    if (code === 4001) setStatus("Connection rejected", "bad");
    else setStatus("Failed to connect", "bad");
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
  if (!wcProvider?.on) return;

  wcProvider.on("accountsChanged", async (accounts) => {
    if (!accounts || !accounts[0]) {
      await disconnectWallet(false);
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
  activeWalletKind = "walletconnect";
  setStatus("Connecting…", "neutral");

  try {
    await initWCProvider();
    wireWCEvents();

    if (!wcProvider?.session) {
      await wcProvider.connect();
    } else {
      try { await wcProvider.enable(); } catch (_) {}
    }
  } catch (e) {
    const msg = String(e?.message || e || "");
    if (msg.toLowerCase().includes("origin")) {
      setStatus("WalletConnect blocked: origin not allowed", "bad");
    } else {
      setStatus("WalletConnect failed. Try Private tab / hard refresh.", "bad");
    }
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
  activeWalletKind = null;

  setDisconnectedUI();
  hideSwitchBtn();
  setStatus("Please connect your wallet", "neutral");
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

usdtInput?.addEventListener("input", recalcSale);

maxBtn?.addEventListener("click", () => {
  const rem = remaining();
  if (usdtInput) usdtInput.value = String(rem);
  recalcSale();
});

buyBtn?.addEventListener("click", async () => {
  const usdt = Number(usdtInput?.value || 0);
  const rem = remaining();

  if (!isConnected()) return;
  if (!isOnBSC()) {
    setStatus("Wrong network: switch to BSC", "bad");
    return;
  }
  if (usdt < MIN_BUY_USDT || usdt > rem) return;

  setStatus("Coming soon", "neutral");
});

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

recalcSale();
setDisconnectedUI();
ensureSwitchBtn();
updateNetworkStatus();
restoreWalletConnectSession();
