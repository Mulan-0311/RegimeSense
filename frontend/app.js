/**
 * APP.JS
 * Market Regime Detection System - Main Application Orchestrator
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Global Application State
  const state = {
    activeTab: 'dashboard',
    asset: 'SPX',
    period: '1Y',
    marketData: null,
    backtestResults: null,
    portfolioAlloc: { equities: 55, bonds: 25, commodities: 10, cash: 10 },
    charts: {}
  };

  // DOM Elements
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const assetSelect = document.getElementById('assetSelect');
  const timeframeBtns = document.querySelectorAll('.btn-timeframe');
  const openAiDrawerBtn = document.getElementById('openAiDrawerBtn');
  const closeAiDrawerBtn = document.getElementById('closeAiDrawerBtn');
  const aiDrawer = document.getElementById('aiDrawer');

  // Initialize App
  init();

  function init() {
    setupNavigation();
    setupEventListeners();
    refreshMarketData();
    renderTickerBar();
    initAiChatUI();
  }

  /* --------------------------------------------------------------------------
     Navigation & Tab Handler
     -------------------------------------------------------------------------- */
  function setupNavigation() {
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.dataset.tab;
        if (targetTab === state.activeTab) return;

        navItems.forEach(n => n.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        item.classList.add('active');
        const activePane = document.getElementById(`tab-${targetTab}`);
        if (activePane) activePane.classList.add('active');

        state.activeTab = targetTab;
        
        // Trigger ECharts resize when tab becomes visible
        setTimeout(() => {
          Object.values(state.charts).forEach(chart => chart && chart.resize());
          if (targetTab === 'analytics') renderAnalyticsCharts();
          if (targetTab === 'portfolio') renderPortfolioCharts();
          if (targetTab === 'backtest') renderBacktestCharts();
        }, 100);
      });
    });
  }

  function setupEventListeners() {
    // Asset Select Change
    if (assetSelect) {
      assetSelect.addEventListener('change', (e) => {
        state.asset = e.target.value;
        refreshMarketData();
      });
    }

    // Timeframe Change
    timeframeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeframeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.period = btn.dataset.period;
        refreshMarketData();
      });
    });

    // AI Drawer Open / Close
    if (openAiDrawerBtn && aiDrawer) {
      openAiDrawerBtn.addEventListener('click', () => aiDrawer.classList.add('open'));
    }
    if (closeAiDrawerBtn && aiDrawer) {
      closeAiDrawerBtn.addEventListener('click', () => aiDrawer.classList.remove('open'));
    }

    // Portfolio Allocation Sliders
    const sliders = ['Equities', 'Bonds', 'Commodities', 'Cash'];
    sliders.forEach(name => {
      const slider = document.getElementById(`slider${name}`);
      const valLabel = document.getElementById(`val${name}`);
      if (slider && valLabel) {
        slider.addEventListener('input', () => {
          valLabel.textContent = `${slider.value}%`;
          state.portfolioAlloc[name.toLowerCase()] = parseInt(slider.value, 10);
          updateTotalAlloc();
          renderPortfolioCharts();
        });
      }
    });

    // Optimize Portfolio Button
    const btnOptimize = document.getElementById('btnOptimizePortfolio');
    if (btnOptimize) {
      btnOptimize.addEventListener('click', () => {
        document.getElementById('sliderEquities').value = 60;
        document.getElementById('valEquities').textContent = '60%';
        document.getElementById('sliderBonds').value = 20;
        document.getElementById('valBonds').textContent = '20%';
        document.getElementById('sliderCommodities').value = 10;
        document.getElementById('valCommodities').textContent = '10%';
        document.getElementById('sliderCash').value = 10;
        document.getElementById('valCash').textContent = '10%';

        state.portfolioAlloc = { equities: 60, bonds: 20, commodities: 10, cash: 10 };
        updateTotalAlloc();
        renderPortfolioCharts();
      });
    }

    // Run Backtest Button
    const runBacktestBtn = document.getElementById('runBacktestBtn');
    if (runBacktestBtn) {
      runBacktestBtn.addEventListener('click', () => {
        runBacktestExecution();
      });
    }

    // Handle Window Resize for ECharts
    window.addEventListener('resize', () => {
      Object.values(state.charts).forEach(chart => chart && chart.resize());
    });
  }

  function updateTotalAlloc() {
    const total = state.portfolioAlloc.equities + state.portfolioAlloc.bonds + 
                  state.portfolioAlloc.commodities + state.portfolioAlloc.cash;
    const label = document.getElementById('totalAllocWeight');
    if (label) {
      label.textContent = `${total}%`;
      label.style.color = total === 100 ? '#00e676' : '#ff4d4d';
    }
  }

  /* --------------------------------------------------------------------------
     Market Data Refresh & Dashboard Rendering
     -------------------------------------------------------------------------- */
  function refreshMarketData() {
    state.marketData = window.DataEngine.generateMarketHistory(state.asset, state.period);
    
    // Update KPI Card Values
    const currentRegime = state.marketData.currentRegime;
    document.getElementById('kpiRegime').textContent = currentRegime.name;
    document.getElementById('kpiRegime').style.color = currentRegime.color;
    document.getElementById('kpiRegimeDuration').textContent = `${state.marketData.regimeDaysCounter} Days`;

    // Sidebar Regime Update
    document.getElementById('sidebarRegimeName').textContent = currentRegime.name.toUpperCase();
    document.getElementById('sidebarRegimeName').style.color = currentRegime.color;

    // Render Dashboard Charts
    renderTimelineChart();
    renderTransitionMatrix();
    renderAlertsFeed();

    if (state.activeTab === 'analytics') renderAnalyticsCharts();
    if (state.activeTab === 'portfolio') renderPortfolioCharts();
    if (state.activeTab === 'backtest') renderBacktestCharts();
  }

  /* --------------------------------------------------------------------------
     Top Ticker Bar Renderer
     -------------------------------------------------------------------------- */
  function renderTickerBar() {
    const tickerContainer = document.getElementById('tickerScroll');
    if (!tickerContainer) return;

    const tickerItems = [
      { symbol: 'S&P 500', price: '5,420.50', change: '+0.84%', pos: true },
      { symbol: 'NASDAQ 100', price: '19,812.20', change: '+1.15%', pos: true },
      { symbol: 'VIX INDEX', price: '12.42', change: '-4.20%', pos: false },
      { symbol: '10Y TREASURY', price: '4.24%', change: '-0.02%', pos: false },
      { symbol: 'GOLD (GLD)', price: '$2,382.40', change: '+0.45%', pos: true },
      { symbol: 'BITCOIN', price: '$66,540', change: '+3.12%', pos: true }
    ];

    tickerContainer.innerHTML = tickerItems.map(item => `
      <div class="ticker-item">
        <span class="ticker-symbol">${item.symbol}</span>
        <span class="ticker-price">${item.price}</span>
        <span class="ticker-change ${item.pos ? 'pos' : 'neg'}">${item.change}</span>
      </div>
    `).join('');
  }

  /* --------------------------------------------------------------------------
     Chart 1: Timeline Chart with Regime Background Colors
     -------------------------------------------------------------------------- */
  function renderTimelineChart() {
    const container = document.getElementById('chartRegimeTimeline');
    if (!container) return;

    if (!state.charts.timeline) {
      state.charts.timeline = echarts.init(container);
    }

    const data = state.marketData;
    const pieces = [];

    // Map regime index to background markAreas
    let currentRegime = data.regimeSeries[0];
    let startIndex = 0;

    for (let i = 1; i < data.dates.length; i++) {
      if (data.regimeSeries[i] !== currentRegime || i === data.dates.length - 1) {
        let color = 'rgba(0, 230, 118, 0.12)';
        if (currentRegime === 1) color = 'rgba(255, 77, 77, 0.12)';
        if (currentRegime === 2) color = 'rgba(255, 186, 56, 0.12)';
        if (currentRegime === 3) color = 'rgba(179, 136, 255, 0.12)';

        pieces.push([
          { xAxis: data.dates[startIndex], itemStyle: { color } },
          { xAxis: data.dates[i] }
        ]);

        currentRegime = data.regimeSeries[i];
        startIndex = i;
      }
    }

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: (params) => {
          const idx = params[0].dataIndex;
          const regCode = ['Bullish Low-Vol', 'Bearish High-Vol', 'Sideways Range', 'Macro Shock'][data.regimeSeries[idx]];
          return `<strong>${params[0].name}</strong><br/>Price: $${params[0].value}<br/>Regime: ${regCode}`;
        }
      },
      grid: { left: '3%', right: '3%', bottom: '10%', top: '5%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.dates,
        axisLine: { lineStyle: { color: '#3f4852' } },
        axisLabel: { color: '#88919d', fontFamily: 'Geist Mono' }
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: '#242a32', type: 'dashed' } },
        axisLabel: { color: '#88919d', fontFamily: 'Geist Mono' }
      },
      series: [
        {
          name: data.assetName,
          type: 'line',
          data: data.prices,
          smooth: true,
          lineStyle: { width: 2, color: '#00a3ff' },
          symbol: 'none',
          markArea: {
            silent: true,
            data: pieces
          }
        }
      ]
    };

    state.charts.timeline.setOption(option);
  }

  /* --------------------------------------------------------------------------
     Markov Transition Matrix Renderer
     -------------------------------------------------------------------------- */
  function renderTransitionMatrix() {
    const container = document.getElementById('transitionMatrixContainer');
    if (!container) return;

    const matrix = state.marketData.transitionMatrix;
    const labels = ['Bullish', 'Bearish', 'Sideways', 'Shock'];

    let html = `
      <div class="matrix-grid">
        <div class="matrix-header-cell">From \\ To</div>
        ${labels.map(l => `<div class="matrix-header-cell">${l}</div>`).join('')}
      </div>
    `;

    for (let i = 0; i < 4; i++) {
      html += `<div class="matrix-grid">`;
      html += `<div class="matrix-row-label">${labels[i]}</div>`;
      for (let j = 0; j < 4; j++) {
        const val = (matrix[i][j] * 100).toFixed(1);
        let bg = 'rgba(0, 163, 255, ' + (matrix[i][j] * 0.8) + ')';
        if (i === j) bg = 'rgba(0, 230, 118, ' + (matrix[i][j] * 0.8) + ')';
        html += `<div class="matrix-val-cell" style="background:${bg}">${val}%</div>`;
      }
      html += `</div>`;
    }

    container.innerHTML = html;
  }

  /* --------------------------------------------------------------------------
     Alerts Feed Renderer
     -------------------------------------------------------------------------- */
  function renderAlertsFeed() {
    const feed = document.getElementById('alertsFeed');
    if (!feed) return;

    const alerts = [
      { type: 'success', title: 'Low Volatility Expansion', desc: 'GARCH volatility dropped to 12.4%, confirming Bullish regime persistence.', time: '10m ago' },
      { type: 'warning', title: 'Yield Curve Flattening', desc: '10Y-2Y spread compressed by 4bps. Increased transition weight to Sideways.', time: '1h ago' },
      { type: 'danger', title: 'Credit Spread Watch', desc: 'HY credit spreads widened by 12bps in early session trading.', time: '3h ago' }
    ];

    feed.innerHTML = alerts.map(a => `
      <div class="alert-card ${a.type}">
        <i class="fa-solid fa-circle-exclamation alert-icon"></i>
        <div class="alert-content">
          <div class="alert-title">${a.title}</div>
          <div class="alert-desc">${a.desc}</div>
        </div>
        <span class="alert-time">${a.time}</span>
      </div>
    `).join('');
  }

  /* --------------------------------------------------------------------------
     Analytics Tab Charts
     -------------------------------------------------------------------------- */
  function renderAnalyticsCharts() {
    const data = state.marketData;

    // Chart 1: HMM Probabilities
    const hmmContainer = document.getElementById('chartHmmProbabilities');
    if (hmmContainer) {
      if (!state.charts.hmm) state.charts.hmm = echarts.init(hmmContainer);

      const p0 = data.hmmProbabilities.map(p => p[0]);
      const p1 = data.hmmProbabilities.map(p => p[1]);
      const p2 = data.hmmProbabilities.map(p => p[2]);
      const p3 = data.hmmProbabilities.map(p => p[3]);

      state.charts.hmm.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '3%', bottom: '10%', top: '5%', containLabel: true },
        xAxis: { type: 'category', data: data.dates, axisLabel: { color: '#88919d' } },
        yAxis: { type: 'value', max: 1, splitLine: { lineStyle: { color: '#242a32' } } },
        series: [
          { name: 'Bullish', type: 'line', stack: 'Total', areaStyle: {}, data: p0, color: '#00e676' },
          { name: 'Bearish', type: 'line', stack: 'Total', areaStyle: {}, data: p1, color: '#ff4d4d' },
          { name: 'Sideways', type: 'line', stack: 'Total', areaStyle: {}, data: p2, color: '#ffba38' },
          { name: 'Shock', type: 'line', stack: 'Total', areaStyle: {}, data: p3, color: '#b388ff' }
        ]
      });
    }

    // Chart 2: Feature Importance
    const featContainer = document.getElementById('chartFeatureImportance');
    if (featContainer) {
      if (!state.charts.feat) state.charts.feat = echarts.init(featContainer);
      state.charts.feat.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: '20%', right: '5%', bottom: '10%', top: '5%' },
        xAxis: { type: 'value', splitLine: { lineStyle: { color: '#242a32' } } },
        yAxis: { type: 'category', data: ['Log Return', 'Credit Spread', '10Y-2Y Slope', 'Realized Vol'], axisLabel: { color: '#fff' } },
        series: [{ type: 'bar', data: [0.18, 0.24, 0.28, 0.38], color: '#00a3ff', borderRadius: [0, 4, 4, 0] }]
      });
    }

    // Chart 3: Cluster Scatter
    const scatterContainer = document.getElementById('chartClusterScatter');
    if (scatterContainer) {
      if (!state.charts.scatter) state.charts.scatter = echarts.init(scatterContainer);
      
      const scatterData = [];
      for (let i = 0; i < data.returns.length; i++) {
        scatterData.push([data.volatility[i], Number((data.returns[i] * 100).toFixed(2)), data.regimeSeries[i]]);
      }

      state.charts.scatter.setOption({
        backgroundColor: 'transparent',
        tooltip: { formatter: (p) => `Vol: ${p.value[0]}% | Return: ${p.value[1]}%` },
        grid: { left: '10%', right: '5%', bottom: '10%', top: '5%' },
        xAxis: { name: 'Realized Vol (%)', type: 'value', splitLine: { lineStyle: { color: '#242a32' } } },
        yAxis: { name: 'Daily Return (%)', type: 'value', splitLine: { lineStyle: { color: '#242a32' } } },
        series: [{
          type: 'scatter',
          symbolSize: 8,
          data: scatterData,
          itemStyle: {
            color: (params) => ['#00e676', '#ff4d4d', '#ffba38', '#b388ff'][params.value[2]]
          }
        }]
      });
    }
  }

  /* --------------------------------------------------------------------------
     Portfolio Impact Charts & Stress Test Table
     -------------------------------------------------------------------------- */
  function renderPortfolioCharts() {
    const container = document.getElementById('chartAllocationComparison');
    if (container) {
      if (!state.charts.alloc) state.charts.alloc = echarts.init(container);

      const alloc = state.portfolioAlloc;
      state.charts.alloc.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: false,
          label: { show: true, color: '#fff', formatter: '{b}: {c}%' },
          data: [
            { value: alloc.equities, name: 'Equities', itemStyle: { color: '#00a3ff' } },
            { value: alloc.bonds, name: 'Bonds', itemStyle: { color: '#00e676' } },
            { value: alloc.commodities, name: 'Commodities', itemStyle: { color: '#ffba38' } },
            { value: alloc.cash, name: 'Cash', itemStyle: { color: '#b388ff' } }
          ]
        }]
      });
    }

    // Stress test table
    const tableBody = document.getElementById('stressTestTableBody');
    if (tableBody) {
      const results = window.DataEngine.calculatePortfolioStressTest(state.portfolioAlloc);
      tableBody.innerHTML = results.map(r => `
        <tr>
          <td style="font-weight:700; color:${r.regime.includes('Bullish') ? '#00e676' : r.regime.includes('Bearish') ? '#ff4d4d' : '#ffba38'}">${r.regime}</td>
          <td>${r.probDuration}</td>
          <td>${r.expReturn}</td>
          <td>${r.volatility}</td>
          <td style="color:#ff4d4d">${r.maxDD}</td>
          <td>${r.sharpe}</td>
          <td>${r.var95}</td>
        </tr>
      `).join('');
    }
  }

  /* --------------------------------------------------------------------------
     Backtest Terminal Charts & Execution
     -------------------------------------------------------------------------- */
  function runBacktestExecution() {
    const strat = document.getElementById('btStrategySelect').value;
    const capital = parseFloat(document.getElementById('btCapital').value) || 100000;
    const defense = document.getElementById('btDefenseAsset').value;

    state.backtestResults = window.DataEngine.runBacktest(state.marketData, strat, capital, defense);
    renderBacktestCharts();
  }

  function renderBacktestCharts() {
    if (!state.backtestResults) runBacktestExecution();
    const bt = state.backtestResults;

    // Equity Curve Chart
    const eqContainer = document.getElementById('chartBacktestEquity');
    if (eqContainer) {
      if (!state.charts.btEquity) state.charts.btEquity = echarts.init(eqContainer);
      state.charts.btEquity.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '3%', bottom: '10%', top: '5%', containLabel: true },
        xAxis: { type: 'category', data: bt.dates, axisLabel: { color: '#88919d' } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: '#242a32' } } },
        series: [
          { name: 'Regime Strategy', type: 'line', data: bt.equityStrategy, color: '#00a3ff', width: 3 },
          { name: 'Buy & Hold Benchmark', type: 'line', data: bt.equityBenchmark, color: '#6c757d', width: 2, lineStyle: { type: 'dashed' } }
        ]
      });
    }

    // Drawdown Chart
    const ddContainer = document.getElementById('chartBacktestDrawdown');
    if (ddContainer) {
      if (!state.charts.btDrawdown) state.charts.btDrawdown = echarts.init(ddContainer);
      state.charts.btDrawdown.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '3%', bottom: '10%', top: '5%', containLabel: true },
        xAxis: { type: 'category', data: bt.dates, axisLabel: { color: '#88919d' } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: '#242a32' } } },
        series: [
          { name: 'Drawdown (%)', type: 'line', areaStyle: { color: 'rgba(255, 77, 77, 0.3)' }, data: bt.drawdownsStrategy, color: '#ff4d4d' }
        ]
      });
    }

    // Metrics Table
    const table = document.getElementById('btMetricsTable');
    if (table) {
      const m = bt.metrics;
      table.innerHTML = `
        <tr><td>Total Strategy Return:</td><td style="color:#00e676; font-weight:700">${m.totalReturnStrategy}</td></tr>
        <tr><td>Benchmark Return:</td><td>${m.totalReturnBenchmark}</td></tr>
        <tr><td>Annualized Return:</td><td>${m.annualizedReturn}</td></tr>
        <tr><td>Annualized Volatility:</td><td>${m.annualizedVol}</td></tr>
        <tr><td>Sharpe Ratio:</td><td style="color:#00a3ff; font-weight:700">${m.sharpeRatio}</td></tr>
        <tr><td>Max Drawdown:</td><td style="color:#ff4d4d">${m.maxDrawdown}</td></tr>
        <tr><td>Win Rate:</td><td>${m.winRate}</td></tr>
      `;
    }
  }

  /* --------------------------------------------------------------------------
     AI Bot UI Initializer (Terminal & Drawer)
     -------------------------------------------------------------------------- */
  function initAiChatUI() {
    const fullHistory = document.getElementById('fullChatHistory');
    const drawerHistory = document.getElementById('drawerChatHistory');

    const fullInput = document.getElementById('fullChatInput');
    const fullSend = document.getElementById('fullChatSendBtn');
    
    const drawerInput = document.getElementById('drawerChatInput');
    const drawerSend = document.getElementById('drawerSendBtn');

    function renderMessages() {
      const messages = window.AiBot.getChatHistory();
      const html = messages.map(m => `
        <div class="chat-msg ${m.sender}">
          <div class="chat-avatar"><i class="fa-solid ${m.sender === 'bot' ? 'fa-robot' : 'fa-user'}"></i></div>
          <div class="chat-bubble">
            ${window.AiBot.formatMarkdown(m.text)}
            <span class="chat-time">${m.time}</span>
          </div>
        </div>
      `).join('');

      if (fullHistory) { fullHistory.innerHTML = html; fullHistory.scrollTop = fullHistory.scrollHeight; }
      if (drawerHistory) { drawerHistory.innerHTML = html; drawerHistory.scrollTop = drawerHistory.scrollHeight; }
    }

    function handleSend(text) {
      if (!text.trim()) return;
      window.AiBot.addMessage('user', text);
      renderMessages();

      // Bot Response
      setTimeout(() => {
        const botReply = window.AiBot.processUserQuery(text, { currentRegime: state.marketData?.currentRegime });
        window.AiBot.addMessage('bot', botReply);
        renderMessages();
      }, 500);
    }

    if (fullSend && fullInput) {
      fullSend.addEventListener('click', () => {
        handleSend(fullInput.value);
        fullInput.value = '';
      });
      fullInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { handleSend(fullInput.value); fullInput.value = ''; }
      });
    }

    if (drawerSend && drawerInput) {
      drawerSend.addEventListener('click', () => {
        handleSend(drawerInput.value);
        drawerInput.value = '';
      });
      drawerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { handleSend(drawerInput.value); drawerInput.value = ''; }
      });
    }

    // Prompt Chips Handler
    document.querySelectorAll('.prompt-chip, .chip-sm').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.dataset.prompt;
        handleSend(prompt);
      });
    });

    renderMessages();
  }

});
