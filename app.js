import { createAppKit } from "https://cdn.jsdelivr.net/npm/@reown/appkit@1.7.7/+esm";
import { EthersAdapter } from "https://cdn.jsdelivr.net/npm/@reown/appkit-adapter-ethers@1.7.7/+esm";

/* =========================
   SALE CONFIG (UI ONLY)
========================= */
const TOTAL_SUPPLY = 50000; // WESEE
const MIN_BUY_USDT = 1;
const PRICE = 1; // 1 USDT = 1 WESEE
let sold = 0;

/* =========================
   WALLET CONFIG
========================= */
const PROJECT_ID = "6cd9185e9e8517c636ebaff85041eaf4";

/* =========================
   BSC NETWORK (MANUAL)
========================= */
const BSC = {
  id: 56,
  name: "BNB Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://bsc-dataseed.binance.org"] },
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
  },
};

/* =========================
   ELEMENTS
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
const remaining = () => TOTAL_SUPPLY - sold;

function setStatus(text) {
  statusText.textContent = text;
}

/* =========================
   SALE UI LOGIC
========================= */
function recalc() {
  const usdt = Number(usdtInput.value || 0);
  weseeInput.value = usdt ? usdt / PRICE : "";
  remainingText.textContent = `${remaining()} WESEE`;

  buyBtn.disabled =
    usdt < MIN_BUY_USDT || usdt > remaining();
}

usdtInput.addEventListener("input", recalc);

buyBtn.addEventListener("click", () => {
  const usdt = Number(usdtInput.value);
  if (usdt < MIN_BUY_USDT) return;

  sold += usdt;
  usdtInput.value = "";
  weseeInput.value = "";
  setStatus("UI demo: purchase simulated ✅");
  recalc();
});

/* =========================
   WALLET INIT (SAFE)
========================= */
let appKit;
let initialized = false;

async function initWallet() {
  if (initialized) return;

  appKit = createAppKit({
    projectId: PROJECT_ID,
    adapters: [new EthersAdapter()],
    networks: [BSC],
    metadata: {
      name: "WeSee",
      description: "WeSee fixed price token sale",
      url: "https://www.wesee.info",
      icons: [], 
    },
  });

  initialized = true;

  const state = appKit.getState();
  if (state?.address) {
    connectBtn.textContent = shortAddr(state.address);
    disconnectBtn.style.display = "inline-block";
  }

  appKit.subscribeState((s) => {
    if (s.address) {
      connectBtn.textContent = shortAddr(s.address);
      disconnectBtn.style.display = "inline-block";
    } else {
      connectBtn.textContent = "Connect Wallet";
      disconnectBtn.style.display = "none";
    }
  });
}

/* =========================
   EVENTS
========================= */
connectBtn.addEventListener("click", async () => {
  try {
    if (!initialized) await initWallet();
    await appKit.open();
  } catch (e) {
    console.error(e);
    alert("Wallet modal failed to open");
  }
});

disconnectBtn.addEventListener("click", async () => {
  await appKit.disconnect();
});

/* =========================
   INIT
========================= */
recalc();
