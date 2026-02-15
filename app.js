(() => {
  // ---- Config (UI-only for now) ----
  const TOTAL_SUPPLY = 50000; // WESEE
  const PRICE_USDT_PER_WESEE = 1; // fixed: 1 USDT = 1 WESEE
  const MIN_BUY_USDT = 1;

  // In UI-only mode, we simulate remaining/sold in-memory.
  // Later, we'll read these from the blockchain.
  let sold = 0;

  // ---- Elements ----
  const usdtInput = document.getElementById("usdtAmount");
  const WESEEInput = document.getElementById("WESEEAmount");
  const remainingText = document.getElementById("remainingText");
  const soldText = document.getElementById("soldText");
  const statusText = document.getElementById("statusText");
  const buyBtn = document.getElementById("buyBtn");
  const maxBtn = document.getElementById("maxBtn");
  const maxHint = document.getElementById("maxHint");
  const connectBtn = document.getElementById("connectBtn");
  const yearEl = document.getElementById("year");

  yearEl.textContent = new Date().getFullYear();

  const formatNumber = (n) => {
    // Keep it simple and readable
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
  };

  const remaining = () => Math.max(0, TOTAL_SUPPLY - sold);

  const setStatus = (type, text) => {
    statusText.classList.remove("neutral", "good", "bad");
    statusText.classList.add(type);
    statusText.textContent = text;
  };

  const sanitizeAmount = (raw) => {
    if (typeof raw !== "string") return "";
    // allow digits + dot only
    const cleaned = raw.replace(/[^\d.]/g, "");
    // prevent multiple dots
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

    WESEEInput.value = cleaned ? formatNumber(outWESEE) : "";

    // Update remaining/sold display
    remainingText.textContent = `${formatNumber(remaining())} WESEE`;
    soldText.textContent = `${formatNumber(sold)} WESEE`;
    maxHint.textContent = formatNumber(remaining());

    // Validate
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

  // ---- Events ----
  usdtInput.addEventListener("input", recalc);

  maxBtn.addEventListener("click", () => {
    const max = remaining(); // 1 USDT = 1 WESEE, so same numeric for now
    usdtInput.value = String(max);
    recalc();
  });

  connectBtn.addEventListener("click", () => {
    // UI placeholder for now
    setStatus("neutral", "Wallet connect will be enabled after Web3 phase");
  });

  buyBtn.addEventListener("click", () => {
    // UI-only simulated purchase
    const usdt = parseAmount(usdtInput.value);
    const WESEE = usdt / PRICE_USDT_PER_WESEE;

    if (usdt < MIN_BUY_USDT) return;
    if (WESEE > remaining()) return;

    sold += WESEE;

    // reset input
    usdtInput.value = "";
    WESEEInput.value = "";

    setStatus("good", "UI demo: purchase simulated ✅");
    recalc();
  });

  // initial paint
  recalc();
})();
