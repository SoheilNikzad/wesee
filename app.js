import EthereumProvider from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";

/* =========================
   SALE CONFIG (UI / LOGIC)
========================= */
const TOKEN_SYMBOL = "WESEE";
const TOTAL_SUPPLY = 50000;
const PRICE_USDT = 1; // 1 USDT = 1 WESEE
const MIN_BUY_USDT = 1;

let sold = 0;

/* =========================
   WALLET / NETWORK CONFIG
========================= */
const WC_PROJECT_ID = "6cd9185e9e8517c636ebaff85041eaf4";

const BSC = {
  chainId: 56,
  name: "BNB Smart Chain",
  rpc: "https://bsc-dataseed.binance.org/",
  symbol: "BNB",
};

/* =========================
   DOM ELEMENTS
========================= */
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");

const usdtInput = document.getElementById("usdtAmount");
const tokenOutput = document.getElementById("weseeAmount");
const buyBtn = document.getElementById("buyBtn");

const remainingText = document.getElementById("remainingText");
const statusText = document.getElementById("statusText");

/* =========================
   HELPERS
========================= */
const shortAddr = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const remaining = () => Math.max(0, TOTAL_SUPPLY - sold);

function setStatus(msg, ok = true) {
  statusText.textContent = msg;
  statusText.style.color = ok ? "#7CFF9B" : "#FF6B6B";
}

/* =========================
   SALE UI LOGIC
========================= */
function recalcSale() {
  const usdt = Number(usdtInput.value || 0);
  tokenOutput.value = usdt ? usdt / PRICE_USDT : "";
  remainingText.textContent = `${remaining()} ${TOKEN_SYMBOL}`;

  buyBtn.disabled =
    usdt < MIN_BUY_USDT ||
    usdt > remaining();
}

usdtInput.addEventListener("input", recalcSale);

buyBtn.addEventListener("click", () => {
  const usdt = Number(usdtInput.value);
  if (usdt < MIN_BUY_USDT) return;

  sold += usdt;
  usdtInput.value = "";
  tokenOutput.value = "";
  recalcSale();

  setStatus("Demo purchase successful (UI only) ✅");
});

/* =========================
   WALLET STATE
========================= */
let externalProvider = null;
let web3Provider = null;
let wcProvider = null;

/* =========================
   WALLET PICKER MODAL
========================= */
function chooseWallet() {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,.6);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
      background: #0f1620;
      border-radius: 16px;
      padding: 20px;
      width: min(420px, 92%);
      color: #e6edf7;
      box-shadow: 0 20px 50px rgba(0,0,0,.5);
    `;

    box.innerHTML = `
      <h3 style="margin-bottom:12px">Connect Wallet</h3>

      <button id="mm" class="wallet-btn">MetaMask</button>
      <button id="trust" class="wallet-btn">Trust Wallet</button>
      <button id="wc" class="wallet-btn wc">WalletConnect</button>

      <button id="cancel" class="wallet-btn cancel">Cancel</button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const cleanup = () => overlay.remove();

    box.querySelector("#mm").onclick = () => { cleanup(); resolve("metamask"); };
    box.querySelector("#trust").onclick = () => { cleanup(); resolve("trust"); };
    box.querySelector("#wc").onclick = () => { cleanup(); resolve("walletconnect"); };
    box.querySelector("#cancel").onclick = () => { cleanup(); resolve(null); };
  });
}

/* =========================
   INJECTED WALLETS
========================= */
function getInjected(kind) {
  const eth = window.ethereum;
  if (!eth) return null;

  const providers = eth.providers ?? [eth];

  if (kind === "metamask")
    return providers.find(p => p.isMetaMask) ?? null;

  if (kind === "trust")
    return providers.find(p => p.isTrust || p.isTrustWallet) ?? null;

  return null;
}

async function connectInjected(kind) {
  const injected = getInjected(kind);
  if (!injected) {
    alert(`${kind} not detected in this browser`);
    return;
  }

  externalProvider = injected;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  await externalProvider.request({ method: "eth_requestAccounts" });

  const signer = web3Provider.getSigner();
  const addr = await signer.getAddress();
  const net = await web3Provider.getNetwork();

  connectBtn.textContent = shortAddr(addr);
  disconnectBtn.style.display = "inline-block";

  if (net.chainId !== BSC.chainId)
    setStatus("Please switch to BSC", false);
  else
    setStatus("Wallet connected ✅");

  externalProvider.on("accountsChanged", () => location.reload());
  externalProvider.on("chainChanged", () => location.reload());
}

/* =========================
   WALLETCONNECT v2
========================= */
async function connectWalletConnect() {
  wcProvider = await EthereumProvider.init({
    projectId: WC_PROJECT_ID,
    chains: [BSC.chainId],
    rpcMap: { [BSC.chainId]: BSC.rpc },
    showQrModal: true,
  });

  await wcProvider.connect();

  externalProvider = wcProvider;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  const signer = web3Provider.getSigner();
  const addr = await signer.getAddress();
  const net = await web3Provider.getNetwork();

  connectBtn.textContent = shortAddr(addr);
  disconnectBtn.style.display = "inline-block";

  if (net.chainId !== BSC.chainId)
    setStatus("Please switch to BSC", false);
  else
    setStatus("Wallet connected ✅");

  wcProvider.on("accountsChanged", () => location.reload());
  wcProvider.on("chainChanged", () => location.reload());
  wcProvider.on("disconnect", disconnectWallet);
}

/* =========================
   DISCONNECT
========================= */
async function disconnectWallet() {
  try {
    if (wcProvider?.disconnect) await wcProvider.disconnect();
  } catch {}

  wcProvider = null;
  externalProvider = null;
  web3Provider = null;

  connectBtn.textContent = "Connect Wallet";
  disconnectBtn.style.display = "none";
  setStatus("Disconnected");
}

/* =========================
   EVENTS
========================= */
connectBtn.addEventListener("click", async () => {
  const choice = await chooseWallet();
  if (!choice) return;

  if (choice === "metamask") await connectInjected("metamask");
  if (choice === "trust") await connectInjected("trust");
  if (choice === "walletconnect") await connectWalletConnect();
});

disconnectBtn.addEventListener("click", disconnectWallet);

/* =========================
   INIT
========================= */
recalcSale();
setStatus("Ready");
