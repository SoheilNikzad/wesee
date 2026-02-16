/* =========================
   SALE CONFIG (UI ONLY)
========================= */
const TOTAL_SUPPLY = 50000; // WESEE
const MIN_BUY_USDT = 1;
const PRICE = 1; // 1 USDT = 1 WESEE
let sold = 0;

/* =========================
   WEB3 CONFIG
========================= */
const PROJECT_ID = "6cd9185e9e8517c636ebaff85041eaf4";
const BSC_CHAIN_ID = 56;

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
   WALLETCONNECT / WEB3MODAL
========================= */
let provider;
let web3Modal;

async function initWeb3Modal() {
  if (web3Modal) return;

  web3Modal = new window.Web3Modal.default({
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: window.WalletConnectProvider.default,
        options: {
          projectId: PROJECT_ID,
          rpc: {
            56: "https://bsc-dataseed.binance.org/",
          },
        },
      },
    },
  });
}

async function connectWallet() {
  try {
    await initWeb3Modal();

    const instance = await web3Modal.connect();
    provider = new ethers.providers.Web3Provider(instance);

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    if (network.chainId !== BSC_CHAIN_ID) {
      setStatus("Please switch to BSC");
    } else {
      setStatus("Wallet connected ✅");
    }

    connectBtn.textContent = shortAddr(address);
    disconnectBtn.style.display = "inline-block";

    instance.on("accountsChanged", () => window.location.reload());
    instance.on("chainChanged", () => window.location.reload());
    instance.on("disconnect", disconnectWallet);
  } catch (err) {
    console.error(err);
    alert("Wallet connection failed");
  }
}

async function disconnectWallet() {
  if (provider?.provider?.disconnect) {
    await provider.provider.disconnect();
  }
  provider = null;

  if (web3Modal) {
    await web3Modal.clearCachedProvider();
  }

  connectBtn.textContent = "Connect Wallet";
  disconnectBtn.style.display = "none";
  setStatus("Disconnected");
}

/* =========================
   EVENTS
========================= */
connectBtn.addEventListener("click", connectWallet);
disconnectBtn.addEventListener("click", disconnectWallet);

/* =========================
   INIT
========================= */
recalc();
