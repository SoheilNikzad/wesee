import EthereumProvider from "https://esm.sh/@walletconnect/ethereum-provider@2.17.2?bundle";
import { ethers } from "https://esm.sh/ethers@5.7.2?bundle";

/* =========================
   SALE CONFIG (UI ONLY)
========================= */
const TOTAL_SUPPLY = 50000; // WESEE
const MIN_BUY_USDT = 1;
const PRICE = 1; // 1 USDT = 1 WESEE
let sold = 0;

/* =========================
   WALLETCONNECT v2 CONFIG
========================= */
const WC_PROJECT_ID = "6cd9185e9e8517c636ebaff85041eaf4";
const BSC_CHAIN_ID = 56;
const BSC_RPC = "https://bsc-dataseed.binance.org/";

/* =========================
   ELEMENTS (همون‌های قبلی)
========================= */
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");

const usdtInput = document.getElementById("usdtAmount");
const weseeInput = document.getElementById("weseeAmount");
const buyBtn = document.getElementById("buyBtn");
const statusText = document.getElementById("statusText");
const remainingText = document.getElementById("remainingText");

/* =========================
   HELPERS
========================= */
const shortAddr = (addr) => addr.slice(0, 6) + "…" + addr.slice(-4);
const remaining = () => Math.max(0, TOTAL_SUPPLY - sold);

function setStatus(text) {
  statusText.textContent = text;
}

/* =========================
   SALE UI LOGIC (همون پیوستگی)
========================= */
function recalc() {
  const usdt = Number(usdtInput.value || 0);
  weseeInput.value = usdt ? usdt / PRICE : "";
  remainingText.textContent = `${remaining()} WESEE`;
  buyBtn.disabled = usdt < MIN_BUY_USDT || usdt > remaining();
}

usdtInput.addEventListener("input", recalc);

buyBtn.addEventListener("click", () => {
  const usdt = Number(usdtInput.value);
  if (usdt < MIN_BUY_USDT) return;
  if (usdt > remaining()) return;

  sold += usdt;
  usdtInput.value = "";
  weseeInput.value = "";
  setStatus("UI demo: purchase simulated ✅");
  recalc();
});

/* =========================
   WALLET (Injected + WC v2)
========================= */
let externalProvider = null;
let web3Provider = null;
let wcProvider = null;

function getInjectedProvider(kind) {
  const eth = window.ethereum;
  if (!eth) return null;

  const providers = eth.providers && Array.isArray(eth.providers) ? eth.providers : null;

  const isMetaMask = (p) => !!p && p.isMetaMask === true;
  const isTrust = (p) => !!p && (p.isTrust === true || p.isTrustWallet === true);

  if (!providers) {
    if (kind === "metamask") return isMetaMask(eth) ? eth : null;
    if (kind === "trust") return isTrust(eth) ? eth : null;
    return eth;
  }

  if (kind === "metamask") return providers.find(isMetaMask) || null;
  if (kind === "trust") return providers.find(isTrust) || null;
  return providers[0] || null;
}

function chooseWallet() {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,.55);
      display:flex; align-items:center; justify-content:center;
      z-index: 9999; padding: 18px;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
      width: min(520px, 100%); background: #0f1620; color: #e6edf7;
      border: 1px solid rgba(255,255,255,.10); border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0,0,0,.45);
      padding: 16px;
    `;

    box.innerHTML = `
      <div style="font-weight:900; font-size:16px; margin-bottom:10px;">Connect wallet</div>
      <div style="color: rgba(230,237,247,.66); font-size:13px; margin-bottom:14px;">
        Choose MetaMask, Trust Wallet, or WalletConnect.
      </div>

      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
        <button id="btnMM" style="flex:1; min-width:160px; padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:#e6edf7; font-weight:900; cursor:pointer;">
          MetaMask
        </button>

        <button id="btnTrust" style="flex:1; min-width:160px; padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:#e6edf7; font-weight:900; cursor:pointer;">
          Trust Wallet
        </button>
      </div>

      <button id="btnWC" style="width:100%; padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,.12); background:linear-gradient(135deg,#ff7a18,#ffb86b); color:#1a0e05; font-weight:900; cursor:pointer; margin-bottom:10px;">
        WalletConnect (QR + All wallets)
      </button>

      <button id="btnCancel" style="width:100%; padding:10px; border-radius:12px; border:1px solid rgba(255,255,255,.12); background:transparent; color:rgba(230,237,247,.8); font-weight:900; cursor:pointer;">
        Cancel
      </button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const cleanup = () => overlay.remove();
    box.querySelector("#btnMM").onclick = () => { cleanup(); resolve("metamask"); };
    box.querySelector("#btnTrust").onclick = () => { cleanup(); resolve("trust"); };
    box.querySelector("#btnWC").onclick = () => { cleanup(); resolve("walletconnect"); };
    box.querySelector("#btnCancel").onclick = () => { cleanup(); resolve(null); };
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) { cleanup(); resolve(null); }
    });
  });
}

async function connectInjected(kind) {
  const injected = getInjectedProvider(kind);
  if (!injected) {
    if (kind === "metamask") alert("MetaMask not detected in this browser.");
    else alert("Trust Wallet not detected here. Open this site inside Trust Wallet browser, or use WalletConnect.");
    return;
  }

  externalProvider = injected;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  await externalProvider.request({ method: "eth_requestAccounts" });

  const signer = web3Provider.getSigner();
  const address = await signer.getAddress();
  const network = await web3Provider.getNetwork();

  connectBtn.textContent = shortAddr(address);
  disconnectBtn.style.display = "inline-block";

  if (network.chainId !== BSC_CHAIN_ID) setStatus("Please switch to BSC");
  else setStatus("Wallet connected ✅");

  externalProvider.on?.("accountsChanged", () => location.reload());
  externalProvider.on?.("chainChanged", () => location.reload());
}

async function connectWalletConnectV2() {
  wcProvider = await EthereumProvider.init({
    projectId: WC_PROJECT_ID,
    chains: [BSC_CHAIN_ID],
    rpcMap: { [BSC_CHAIN_ID]: BSC_RPC },
    showQrModal: true
  });

  await wcProvider.connect();

  externalProvider = wcProvider;
  web3Provider = new ethers.providers.Web3Provider(externalProvider, "any");

  const signer = web3Provider.getSigner();
  const address = await signer.getAddress();
  const network = await web3Provider.getNetwork();

  connectBtn.textContent = shortAddr(address);
  disconnectBtn.style.display = "inline-block";

  if (network.chainId !== BSC_CHAIN_ID) setStatus("Please switch to BSC");
  else setStatus("Wallet connected ✅");

  wcProvider.on?.("accountsChanged", () => location.reload());
  wcProvider.on?.("chainChanged", () => location.reload());
  wcProvider.on?.("disconnect", () => disconnectWallet());
}

async function disconnectWallet() {
  try {
    if (wcProvider?.disconnect) await wcProvider.disconnect();
  } catch (_) {}

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
  try {
    const choice = await chooseWallet();
    if (!choice) return;

    if (choice === "metamask") await connectInjected("metamask");
    if (choice === "trust") await connectInjected("trust");
    if (choice === "walletconnect") await connectWalletConnectV2();
  } catch (e) {
    console.error(e);
    alert("Wallet connect failed. Check console.");
  }
});

disconnectBtn.addEventListener("click", disconnectWallet);

/* =========================
   INIT
========================= */
recalc();
