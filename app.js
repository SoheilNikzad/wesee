(() => {
  // ==========================
  // UI CONFIG (demo)
  // ==========================
  const TOTAL_SUPPLY = 50000; // WESEE
  const PRICE_USDT_PER_WESEE = 1; // fixed: 1 USDT = 1 WESEE
  const MIN_BUY_USDT = 1;

  // Web3 (Reown AppKit) Config
  const REOWN_PROJECT_ID = "6cd9185e9e8517c636ebaff85041eaf4";
  const APP_NAME = "WeSee";
  const APP_DESCRIPTION = "Fixed price token sale";
  const APP_URL = "https://wesee.info";
  // simple icon (optional); you can put a real icon later
  const APP_ICONS = ["https://wesee.info/assets/wesee-icon.png"];

  // In UI-only mode, we simulate remaining/sold in-memory.
  let sold = 0;

  // ==========================
  // ELEMENTS
  // ==========================
  const usdtInput = document.getElementById("usdtAmount");
  const weseeInput = document.getElementById("weseeAmount");
  const remainingText = document.getElementById("remainingText");
  const soldText = document.getElementById("soldText");
  const statusText = document.getElementById("statusText");
  const buyBtn = document.getElementById("buyBtn");
  const maxBtn = document.getElementById("maxBtn");
  const maxHint = document.getElementById("maxHint");
  const connectBtn = document.getElementById("connectBtn");
  const disconnectBtn = document.getElementById("disconnectBtn");
  const yearEl = document.getElementById("year");

  yearEl.textContent = new Date().getFullYear();

  // ==========================
  // HELPERS
  // ==========================
  const formatNumber = (n) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);

  const shortAddr = (addr) => {
    if (!addr || typeof addr !== "string") return "";
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
    };

  const remaining = () => Math.max(0, TOTAL_SUPPLY - sold);

  const setStatus = (type, text) => {
    statusText.classList.remove("neutral", "good", "bad");
    statusText.classList.add(type);
    statusText.textContent = text;
  };

  const sanitizeAmount = (raw) => {
    if (typeof raw !== "string") return "";
    const cleaned = raw.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length <= 2) return cleaned;
    return parts[0] + "." + parts.slice(1).join("");
  };

  const parseAmount = (raw) => {
    const v = Number(raw);
    return Number.isFinite(v) ? v : 0;
  };

  const recalc = () => {
    const cleaned = sanitizeAmount(usdtInput.value);
    if (cleaned !== usdtInput.value) usdtInput.value = cleaned;

    const usdt = parseAmount(cleaned);
    const outWESEE = usdt / PRICE_USDT_PER_WESEE;

    weseeInput.value = cleaned ? formatNumber(outWESEE) : "";

    remainingText.textContent = `${formatNumber(remaining())} WESEE`;
    soldText.textContent = `${formatNumber(sold)} WESEE`;
    maxHint.textContent = formatNumber(remaining());

    if (!cleaned || usdt === 0) {
      buyBtn.disabled = true;
      setStatus("neutral", "Ready");
      return;
    }
    if (usdt < MIN_BUY_USDT) {
      buyBtn.disabled = true;
      setStatus("bad", `Minimum is ${MIN_BUY_USDT} USDT`);
      return;
    }
    if (outWESEE > remaining()) {
      buyBtn.disabled = true;
      setStatus("bad", "Amount exceeds remaining supply");
      return;
    }

    buyBtn.disabled = false;
    setStatus("good", "Valid amount");
  };

  // ==========================
  // WEB3: Reown AppKit (WalletConnect)
  // ==========================
  // We load AppKit via ESM from CDN (works on GitHub Pages).
  // If your environment blocks ESM, tell me and we'll switch.
  let appKit = null;
  let connectedAddress = null;

  const setConnectedUI = (address) => {
    connectedAddress = address;
    connectBtn.textContent = shortAddr(address);
    disconnectBtn.style.display = "inline-block";
  };

  const setDisconnectedUI = () => {
    connectedAddress = null;
    connectBtn.textContent = "Connect Wallet";
    disconnectBtn.style.display = "none";
  };

  const ensureAppKit = async () => {
    if (appKit) return appKit;

    // Dynamically import Reown AppKit (ESM)
    const [{ createAppKit }, { mainnet, bsc }] = await Promise.all([
      import("https://unpkg.com/@reown/appkit@1.7.7/dist/index.js"),
      import("https://unpkg.com/@reown/appkit/networks/dist/index.js"),
    ]);

    // We want BSC as primary target.
    appKit = createAppKit({
      projectId: REOWN_PROJECT_ID,
      networks: [bsc, mainnet],
      metadata: {
        name: APP_NAME,
        description: APP_DESCRIPTION,
        url: APP_URL,
        icons: APP_ICONS,
      },
    });

    // Try restore session (if previously connected)
    const state = appKit.getState?.();
    const addr = state?.address;
    if (addr) setConnectedUI(addr);

    // Listen for state changes (connect/disconnect)
    if (appKit.subscribeState) {
      appKit.subscribeState((s) => {
        if (s?.address) setConnectedUI(s.address);
        else setDisconnectedUI();
      });
    }

    return appKit;
  };

  // ==========================
  // EVENTS
  // ==========================
  usdtInput.addEventListener("input", recalc);

  maxBtn.addEventListener("click", () => {
    usdtInput.value = String(remaining());
    recalc();
  });

  connectBtn.addEventListener("click", async () => {
    try {
      const kit = await ensureAppKit();
      // Opens the modal
      await kit.open();
    } catch (e) {
      console.error(e);
      setStatus("bad", "Wallet modal failed to open");
    }
  });

  disconnectBtn.addEventListener("click", async () => {
    try {
      const kit = await ensureAppKit();
      // Depending on SDK version, disconnect method might differ.
      // We try the most common ones safely.
      if (kit.disconnect) await kit.disconnect();
      else if (kit?.adapter?.disconnect) await kit.adapter.disconnect();
      setDisconnectedUI();
      setStatus("neutral", "Disconnected");
    } catch (e) {
      console.error(e);
      setStatus("bad", "Disconnect failed");
    }
  });

  buyBtn.addEventListener("click", () => {
    // UI-only simulated purchase
    const usdt = parseAmount(usdtInput.value);
    const outWESEE = usdt / PRICE_USDT_PER_WESEE;

    if (usdt < MIN_BUY_USDT) return;
    if (outWESEE > remaining()) return;

    sold += outWESEE;
    usdtInput.value = "";
    weseeInput.value = "";
    setStatus("good", "UI demo: purchase simulated ✅");
    recalc();
  });

  // initial paint
  recalc();
})();
