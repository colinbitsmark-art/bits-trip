const state = {
  mode: "flight",
  sort: "best",
  cryptoCurrency: "USDT",
  cartCount: 0,
  pendingOrder: null,
  forms: {
    flight: {
      from: "上海",
      to: "成都",
    },
    hotel: {
      destination: "成都",
      area: "春熙路",
    },
  },
};

const cryptoRates = {
  USDT: {
    cny: 7.2,
    decimals: 2,
    network: "TRC20",
    wallet: "TBitsTripUSDT9x8fQ7DemoPayVault",
  },
  BTC: {
    cny: 720000,
    decimals: 6,
    network: "Bitcoin",
    wallet: "bc1qbitstripdemo7m2qz4p9xvirtualpay",
  },
};

const today = new Date();
const formatDate = (date) => date.toISOString().slice(0, 10);
const addDays = (days) => {
  const next = new Date(today);
  next.setDate(today.getDate() + days);
  return formatDate(next);
};

const images = {
  plane: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
  cabin: "https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=900&q=80",
  runway: "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=900&q=80",
  room: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  lobby: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
  pool: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80",
};

const flightDeals = [
  {
    id: "mu5295",
    title: "东方航空 MU5295",
    subtitle: "虹桥 T2 09:35 起飞，双流 T2 12:45 抵达",
    badge: "直飞",
    time: "3小时10分",
    score: "准点率 92%",
    feature: "fast",
    price: 860,
    image: images.plane,
  },
  {
    id: "ca4512",
    title: "国航 CA4512",
    subtitle: "浦东 T2 14:10 起飞，天府 T2 17:30 抵达",
    badge: "商务优选",
    time: "3小时20分",
    score: "含 20kg 行李",
    feature: "refund",
    price: 1120,
    image: images.cabin,
  },
  {
    id: "3u8968",
    title: "四川航空 3U8968",
    subtitle: "虹桥 T2 20:05 起飞，双流 T2 23:20 抵达",
    badge: "夜间低价",
    time: "3小时15分",
    score: "可选餐食",
    feature: "best",
    price: 690,
    image: images.runway,
  },
];

const hotelDeals = [
  {
    id: "chengdu-center",
    title: "成都太古里云景酒店",
    subtitle: "春熙路步行 6 分钟，近地铁 2/3 号线",
    badge: "高分酒店",
    time: "4.8 分",
    score: "含双早",
    feature: "breakfast",
    price: 528,
    image: images.room,
  },
  {
    id: "river-view",
    title: "锦江河畔设计公馆",
    subtitle: "夜景房型，适合周末短住和情侣出行",
    badge: "免费取消",
    time: "4.7 分",
    score: "延迟退房",
    feature: "refund",
    price: 618,
    image: images.lobby,
  },
  {
    id: "garden-stay",
    title: "宽窄巷子花园里酒店",
    subtitle: "庭院式客房，步行可达热门餐厅街区",
    badge: "城市度假",
    time: "4.9 分",
    score: "含早餐",
    feature: "breakfast",
    price: 738,
    image: images.pool,
  },
];

const refs = {
  form: document.querySelector("#searchForm"),
  tabs: document.querySelectorAll(".tab"),
  fromInput: document.querySelector("#fromInput"),
  toInput: document.querySelector("#toInput"),
  startDate: document.querySelector("#startDate"),
  endDate: document.querySelector("#endDate"),
  fromLabel: document.querySelector("#fromLabel"),
  toLabel: document.querySelector("#toLabel"),
  startDateLabel: document.querySelector("#startDateLabel"),
  endDateLabel: document.querySelector("#endDateLabel"),
  peopleLabel: document.querySelector("#peopleLabel"),
  peopleInput: document.querySelector("#peopleInput"),
  resultList: document.querySelector("#resultList"),
  summaryTitle: document.querySelector("#summaryTitle"),
  summaryMeta: document.querySelector("#summaryMeta"),
  budgetRange: document.querySelector("#budgetRange"),
  budgetLabel: document.querySelector("#budgetLabel"),
  budgetText: document.querySelector("#budgetText"),
  cryptoSwitch: document.querySelector("#cryptoSwitch"),
  rateText: document.querySelector("#rateText"),
  currencyButtons: document.querySelectorAll("[data-currency]"),
  resetBtn: document.querySelector("#resetBtn"),
  swapBtn: document.querySelector("#swapBtn"),
  sortButtons: document.querySelectorAll(".sort-control button"),
  cartCount: document.querySelector("#cartCount"),
  cartText: document.querySelector("#cartText"),
  dialog: document.querySelector("#bookingDialog"),
  dialogSubtitle: document.querySelector("#dialogSubtitle"),
  dialogDetails: document.querySelector("#dialogDetails"),
  paymentPanel: document.querySelector("#paymentPanel"),
  paymentStatus: document.querySelector("#paymentStatus"),
  paymentHint: document.querySelector("#paymentHint"),
  walletAddress: document.querySelector("#walletAddress"),
  copyWalletBtn: document.querySelector("#copyWalletBtn"),
  payButton: document.querySelector("#payButton"),
};

refs.startDate.value = addDays(7);
refs.endDate.value = addDays(10);

function activeDeals() {
  return state.mode === "flight" ? flightDeals : hotelDeals;
}

function checkedFeatures() {
  return [...document.querySelectorAll(".check-list input:checked")].map((input) => input.dataset.feature);
}

function sortedDeals(items) {
  const deals = [...items];
  if (state.sort === "price") {
    return deals.sort((a, b) => a.price - b.price);
  }
  if (state.sort === "time") {
    return deals.sort((a, b) => a.time.localeCompare(b.time, "zh-CN"));
  }
  return deals;
}

function activeRate() {
  return cryptoRates[state.cryptoCurrency];
}

function convertToCrypto(cny) {
  return cny / activeRate().cny;
}

function formatCrypto(cny) {
  return `${convertToCrypto(cny).toFixed(activeRate().decimals)} ${state.cryptoCurrency}`;
}

function formatPrice(cny, unit) {
  if (state.mode === "flight") {
    return `${formatCrypto(cny)}<small> 起 / ${unit}</small>`;
  }
  return `¥${cny}<small> 起 / ${unit}</small>`;
}

function formatOrderTotal(cny) {
  return state.mode === "flight" ? formatCrypto(cny) : `¥${cny}`;
}

function formatRateValue(rate) {
  return state.cryptoCurrency === "USDT" ? rate.cny.toFixed(2) : rate.cny.toLocaleString("zh-CN");
}

function updateCryptoCopy() {
  const isFlight = state.mode === "flight";
  const rate = activeRate();
  refs.cryptoSwitch.hidden = !isFlight;
  refs.budgetLabel.textContent = isFlight ? "加密预算上限" : "预算上限";
  refs.budgetText.textContent = isFlight ? formatCrypto(Number(refs.budgetRange.value)) : `¥${refs.budgetRange.value}`;
  refs.rateText.textContent = `模拟汇率 · 1 ${state.cryptoCurrency} = ¥${formatRateValue(rate)}`;
}

function updateCopy() {
  const isFlight = state.mode === "flight";
  refs.fromLabel.textContent = isFlight ? "出发城市" : "目的地";
  refs.toLabel.textContent = isFlight ? "到达城市" : "商圈 / 酒店名";
  refs.startDateLabel.textContent = isFlight ? "出发日期" : "入住日期";
  refs.endDateLabel.textContent = isFlight ? "返程日期" : "离店日期";
  refs.peopleLabel.textContent = isFlight ? "乘机人" : "住客";
  refs.summaryTitle.textContent = isFlight
    ? `${refs.fromInput.value} → ${refs.toInput.value}`
    : `${refs.fromInput.value} · ${refs.toInput.value}`;
  refs.summaryMeta.textContent = isFlight
    ? `往返机票 · ${refs.peopleInput.value} · ${state.cryptoCurrency} 虚拟支付 · 模拟汇率显示`
    : `酒店住宿 · ${refs.peopleInput.value} · 优先展示位置便利和可取消房型`;
  updateCryptoCopy();
}

function renderResults() {
  const budget = Number(refs.budgetRange.value);
  const features = checkedFeatures();
  const visible = sortedDeals(activeDeals()).filter((deal) => {
    const withinBudget = deal.price <= budget;
    const matchesFeature = features.length === 0 || features.includes(deal.feature) || deal.feature === "best";
    return withinBudget && matchesFeature;
  });

  updateCopy();

  if (!visible.length) {
    refs.resultList.innerHTML = '<div class="empty-state">暂时没有符合预算和偏好的方案。</div>';
    return;
  }

  refs.resultList.innerHTML = visible
    .map(
      (deal) => `
        <article class="result-card">
          <div class="result-media">
            <img src="${deal.image}" alt="${deal.title}" />
            <span class="result-badge">${deal.badge}</span>
          </div>
          <div class="result-body">
            <div class="result-main">
              <div>
                <h3>${deal.title}</h3>
                <p>${deal.subtitle}</p>
              </div>
              <span class="tag">${deal.score}</span>
            </div>
            <div class="result-meta">
              <span>${deal.time}</span>
              <span>${state.mode === "flight" ? "电子客票" : "到店付款可选"}</span>
              <span>${state.mode === "flight" ? "支持改签" : "保留房至 20:00"}</span>
            </div>
            <div class="price-row">
              <div class="price">${formatPrice(deal.price, state.mode === "flight" ? "人" : "晚")}</div>
              <button class="book-btn" type="button" data-id="${deal.id}">预订</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function showDialog(deal) {
  const people = Number.parseInt(refs.peopleInput.value, 10);
  const total = deal.price * people;
  const isFlight = state.mode === "flight";
  const orderId = `BT-${Date.now().toString(36).toUpperCase()}`;
  const paymentAmount = formatOrderTotal(total);

  state.cartCount += 1;
  state.pendingOrder = {
    id: orderId,
    isFlight,
    title: deal.title,
    amount: paymentAmount,
    currency: state.cryptoCurrency,
  };
  refs.cartCount.textContent = state.cartCount;
  refs.cartText.textContent = isFlight
    ? `${deal.title} 已加入行程，待支付 ${paymentAmount}。`
    : `${deal.title} 已加入行程，预计总价 ${paymentAmount} 起。`;
  refs.dialogSubtitle.textContent = `${deal.title} 已加入行程`;
  refs.dialogDetails.innerHTML = `
    <dt>订单号</dt><dd>${orderId}</dd>
    <dt>类型</dt><dd>${isFlight ? "机票" : "酒店"}</dd>
    <dt>日期</dt><dd>${refs.startDate.value} 至 ${refs.endDate.value}</dd>
    <dt>人数</dt><dd>${refs.peopleInput.value}</dd>
    <dt>${isFlight ? "链上金额" : "价格"}</dt><dd>${paymentAmount}${isFlight ? "" : " 起"}</dd>
    ${isFlight ? `<dt>结算网络</dt><dd>${activeRate().network}</dd>` : ""}
  `;
  refs.paymentPanel.hidden = !isFlight;
  refs.payButton.textContent = isFlight ? `支付 ${paymentAmount}` : "确认预订";

  if (isFlight) {
    refs.paymentStatus.textContent = "虚拟支付待确认";
    refs.paymentHint.textContent = `使用 ${state.cryptoCurrency} 向模拟地址付款，确认后会标记为已支付。`;
    refs.walletAddress.textContent = activeRate().wallet;
    refs.copyWalletBtn.textContent = "复制地址";
  }

  if (typeof refs.dialog.showModal === "function") {
    refs.dialog.showModal();
  }
}

refs.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    saveCurrentForm();
    state.mode = tab.dataset.mode;
    restoreCurrentForm();
    refs.tabs.forEach((item) => {
      item.classList.toggle("active", item === tab);
      item.setAttribute("aria-selected", String(item === tab));
    });
    renderResults();
  });
});

refs.currencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.cryptoCurrency = button.dataset.currency;
    refs.currencyButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderResults();
  });
});

refs.form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveCurrentForm();
  renderResults();
  document.querySelector("#deals").scrollIntoView({ behavior: "smooth", block: "start" });
});

refs.resultList.addEventListener("click", (event) => {
  const button = event.target.closest(".book-btn");
  if (!button) return;
  const deal = activeDeals().find((item) => item.id === button.dataset.id);
  if (deal) showDialog(deal);
});

refs.budgetRange.addEventListener("input", renderResults);

document.querySelectorAll(".check-list input").forEach((input) => {
  input.addEventListener("change", renderResults);
});

refs.sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.sort = button.dataset.sort;
    refs.sortButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderResults();
  });
});

refs.resetBtn.addEventListener("click", () => {
  refs.budgetRange.value = 1800;
  document.querySelectorAll(".check-list input").forEach((input) => {
    input.checked = input.dataset.feature !== "refund";
  });
  renderResults();
});

refs.swapBtn.addEventListener("click", () => {
  if (state.mode !== "flight") return;
  [refs.fromInput.value, refs.toInput.value] = [refs.toInput.value, refs.fromInput.value];
  saveCurrentForm();
  renderResults();
});

refs.copyWalletBtn.addEventListener("click", async () => {
  const address = refs.walletAddress.textContent;
  try {
    await navigator.clipboard.writeText(address);
    refs.copyWalletBtn.textContent = "已复制";
  } catch {
    refs.copyWalletBtn.textContent = "请手动复制";
  }
});

refs.dialog.addEventListener("close", () => {
  if (refs.dialog.returnValue !== "confirm" || !state.pendingOrder) return;

  if (state.pendingOrder.isFlight) {
    refs.cartText.textContent = `${state.pendingOrder.title} 已完成虚拟支付，金额 ${state.pendingOrder.amount}，订单号 ${state.pendingOrder.id}。`;
    return;
  }

  refs.cartText.textContent = `${state.pendingOrder.title} 已确认预订，订单号 ${state.pendingOrder.id}。`;
});

function saveCurrentForm() {
  if (state.mode === "flight") {
    state.forms.flight.from = refs.fromInput.value || "上海";
    state.forms.flight.to = refs.toInput.value || "成都";
    return;
  }
  state.forms.hotel.destination = refs.fromInput.value || state.forms.flight.to || "成都";
  state.forms.hotel.area = refs.toInput.value || "春熙路";
}

function restoreCurrentForm() {
  if (state.mode === "flight") {
    refs.fromInput.value = state.forms.flight.from;
    refs.toInput.value = state.forms.flight.to;
    return;
  }
  refs.fromInput.value = state.forms.hotel.destination;
  refs.toInput.value = state.forms.hotel.area;
}

renderResults();
