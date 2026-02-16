import { createAppKit } from "https://cdn.jsdelivr.net/npm/@reown/appkit@1.7.7/+esm";
import { EthersAdapter } from "https://cdn.jsdelivr.net/npm/@reown/appkit-adapter-ethers@1.7.7/+esm";
import { bsc } from "https://cdn.jsdelivr.net/npm/@reown/appkit/networks@1.7.7/+esm";

const PROJECT_ID = "6cd9185e9e8517c636ebaff85041eaf4";

const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");

let appKit;
let initialized = false;

function shortAddr(addr) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

async function initWallet() {
  if (initialized) return;

  appKit = createAppKit({
    projectId: PROJECT_ID,
    adapters: [new EthersAdapter()],
    networks: [bsc],
    metadata: {
      name: "WeSee",
      description: "WeSee token sale",
      url: "https://www.wesee.info",
      icons: ["https://www.wesee.info/favicon.ico"],
    },
  });

  initialized = true;

  // restore session
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

connectBtn.addEventListener("click", async () => {
  try {
    if (!initialized) await initWallet();
    await appKit.open();
  } catch (err) {
    console.error("Wallet open failed:", err);
    alert("Wallet modal failed to open (check console)");
  }
});

disconnectBtn.addEventListener("click", async () => {
  try {
    await appKit.disconnect();
  } catch (e) {
    console.error(e);
  }
});
