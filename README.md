```
██████╗ ███████╗ ██████╗ ██╗███╗   ███╗███████╗███████╗███████╗███╗   ██╗███████╗███████╗
██╔══██╗██╔════╝██╔════╝ ██║████╗ ████║██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝██╔════╝
██████╔╝█████╗  ██║  ███╗██║██╔████╔██║█████╗  ███████╗█████╗  ██╔██╗ ██║███████╗█████╗  
██╔══██╗██╔══╝  ██║   ██║██║██║╚██╔╝██║██╔══╝  ╚════██║██╔══╝  ██║╚██╗██║╚════██║██╔══╝  
██║  ██║███████╗╚██████╔╝██║██║ ╚═╝ ██║███████╗███████║███████╗██║ ╚████║███████║███████╗
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝
```
<div align="center">

<img src="https://img.shields.io/badge/RegimeSense-v1.0.0-00d4ff?style=for-the-badge&logo=googleanalytics&logoColor=white"/>
<img src="https://img.shields.io/badge/Quant_Finance-Algorithmic_Trading-ff3366?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Institutional-Grade-00ff88?style=for-the-badge"/>

<br/>

### Institutional-Grade Market Regime Classifier & AI Quant Copilot

**Quantitative Market Analytics · Algorithmic Strategy · Portfolio Backtesting**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![HTML5](https://img.shields.io/badge/HTML5-Vanilla_JS-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![ECharts](https://img.shields.io/badge/Apache_ECharts-5.x-AA344D?style=flat-square&logo=apache&logoColor=white)](https://echarts.apache.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org)

</div>

---

## Core Platform Capabilities (v1.0 Prototype)
*   **Unified Quant Terminal**: A comprehensive, low-latency command center providing real-time market state synchronization across all analytical modules.
*   **Hidden Markov Model (HMM) Classifier**: Utilizes a dynamic 4-state probabilistic model to classify market regimes (Bullish, Bearish, High Volatility, Sideways) in real-time.
*   **AI Quant Copilot**: Context-aware analytical assistant powered by advanced LLM inference to dynamically interpret market telemetry and provide actionable trading strategies.
*   **Portfolio Backtesting & Paper Trading**: Asynchronous paper trading engine designed to validate strategy efficacy and record simulated performance through SQLite persistence.

---

## Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Platform Architecture](#-platform-architecture)
- [Modules](#-modules)
  - [MRC — Market Regime Classifier](#module-1-mrc--market-regime-classifier)
  - [AQC — AI Quant Copilot](#module-2-aqc--ai-quant-copilot)
  - [PTE — Paper Trading Engine](#module-3-pte--paper-trading-engine)
  - [MHO — Market Heatmap & Asset Overlay](#module-4-mho--market-heatmap--asset-overlay)
- [Key Metrics](#-key-metrics)
- [Datasets Used](#-datasets-used)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Demo Scenarios](#-demo-scenarios)
- [Security & Compliance](#-security--compliance)
- [Scalability](#-scalability)
- [Team](#-team)

---

## Problem Statement

Retail traders and institutional funds operating in modern financial markets are subjected to **unprecedented volatility and algorithmic manipulation**.

| Statistic | Impact |
|-----------|--------|
| **80%+** retail traders lose money | Inability to adapt to shifting market states |
| **Flash Crashes** happening in milliseconds | Stop-losses hunted and liquidity drained |
| **Sideways Markets** destroying premium | Option buyers suffer extreme theta decay |
| **Macro Shocks** unpredictable via technicals | Pure price-action models consistently fail |
| **Siloed Data** across multiple platforms | Traders operate with delayed, fragmented info |

**The core gap**: Traditional lagging indicators (RSI, MACD, Moving Averages) fail to mathematically classify the *underlying state* of the market. Traders apply trending strategies in choppy markets, resulting in devastating drawdowns. 

---

## Solution Overview

**RegimeSense** is a **probabilistic market intelligence platform** that shifts traders from reactive indicator-chasing to **proactive statistical modeling**. 

```
Traditional Retail: Lagging Indicators → Reactive Trades ❌
RegimeSense:        HMM State Prediction → Adaptive Alpha ✅
```

### What makes it different

| Capability | Traditional Brokerage | RegimeSense |
|-----------|-----------------|----------------|
| Market Analysis | RSI, MACD, Trendlines | Hidden Markov Models (HMM) |
| Strategy Adaptation | Manual guessing | Dynamic per-regime playbook |
| Insights | Generic news feeds | Context-aware AI Quant Copilot |
| Visualization | Standard Candlesticks | Cluster Scatters & Transition Matrices |
| Execution | Blind market orders | Simulated backtesting & edge validation |

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               REGIMESENSE — 5-LAYER ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  LAYER 5 │ PRESENTATION                                                             │
│          │  Terminal Dashboard  │  Asset Overlay View  │  Market Heatmap View       │
│          │  Auth Screens (Sign In/Join)  │  AI Command Drawer                       │
├──────────┼──────────────────────────────────────────────────────────────────────────┤
│  LAYER 4 │ EXECUTION & ORCHESTRATION                                                │
│          │  Paper Trading Engine  →  Portfolio State Manager  →  Alerts Dispatcher  │
├──────────┼──────────────────────────────────────────────────────────────────────────┤
│  LAYER 3 │ INTELLIGENCE ENGINES                                                     │
│          │  MRC (HMM Classifier)  │  AQC (AI Copilot)  │  Backtest Analytics        │
├──────────┼──────────────────────────────────────────────────────────────────────────┤
│  LAYER 2 │ DATA PIPELINE                                                            │
│          │  Data Normalization  →  Feature Engineering (Volatility, Returns)        │
├──────────┼──────────────────────────────────────────────────────────────────────────┤
│  LAYER 1 │ DATA COLLECTION                                                          │
│          │  Synthetic Data Generator (Dev)  │  Live Brokerage APIs (Prod)           │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Modules

---

### Module 1: MRC — Market Regime Classifier

> *Stop fighting the tape. Mathematically define the market state.*

**Purpose**: Build multidimensional time-series models to classify the latent, hidden state of the market using a 4-state Hidden Markov Model (HMM).

#### How It Works

```
Asset Price & Volume Telemetry
        │
        ▼
┌───────────────────┐     ┌──────────────────────┐
│ Log-Returns &     │────▶│ Gaussian Hidden      │
│ Volatility Engine │     │ Markov Model (HMM)   │
└───────────────────┘     └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │ Output Probabilities │
                          │ (State 0, 1, 2, 3)   │
                          └──────────┬───────────┘
                                     │
                     ┌───────────────┼───────────────┐
                     ▼               ▼               ▼
                 Bullish         Bearish         High Volatility
                 (Trend)         (Risk Off)      (Sideways Chop)
```

#### Key Features
- **4-State Classification**: Identifies Bullish, Bearish, Sideways/Chop, and High Volatility regimes.
- **Transition Probability Matrix**: Real-time matrix visualising the mathematical probability of transitioning from one regime to another.
- **Cluster Scatter Plots**: Beautiful 3D/2D scatter plots mapping returns against volatility to visually cluster market regimes.

---

### Module 2: AQC — AI Quant Copilot

> *Your institutional analyst, awake 24/7.*

**Purpose**: Provide an interactive, terminal-style AI assistant that reads the current HMM probabilities and gives institutional-grade strategy advice.

#### Key Features
- **Context-Aware**: Reads the live DOM and current regime states before answering.
- **Terminal UI**: Hacker-style slide-out drawer interface for seamless workflow.
- **Playbook Generation**: Automatically suggests options strategies (Iron Condors for Chop, Call Spreads for Bullish) based on the detected state.

---

### Module 3: PTE — Paper Trading Engine

> *Validate your edge before risking capital.*

**Purpose**: Simulate execution and track portfolio metrics securely.

#### Key Features
- **Local State Persistence**: Manages portfolio balance, PNL, and open positions dynamically.
- **SQLite Backend**: Scalable backend ready for relational trade journaling via FastAPI.
- **Slippage & Commission Simulation**: Realistic institutional trading constraints.

---

### Module 4: MHO — Market Heatmap & Asset Overlay

> *See the entire board at a single glance.*

**Purpose**: High-level macro views of correlated assets.

#### Key Features
- **Cross-Asset Correlation**: View equities, crypto, and forex regimes on a single heatmap.
- **Regime Overlay**: Overlay historical regime classifications directly on top of price action candlesticks to backtest human intuition.

---

## Key Metrics

| Metric | Target | Method |
|--------|--------|--------|
| **Classification Latency**| < 100ms | HMM vectorised computation |
| **UI Render Time**| < 16ms (60 FPS) | Vanilla JS + Apache ECharts |
| **State Sync**| Real-time | LocalStorage / SQLite API |
| **Drawdown Reduction**| > 40% | Regime-based position sizing |

---


## Datasets Used

| Dataset | Source | Purpose |
|---------|--------|---------|
| **Synthetic HMM Data**| Procedural Generator | Local UI/UX testing and pipeline validation |
| **SPY / QQQ Daily**| Yahoo Finance / Alpaca | Production regime classification |
| **VIX Index**| CBOE | Volatility feature engineering |

---

## Tech Stack

### AI/ML Layer
| Technology | Use |
|-----------|-----|
| **Scikit-learn / hmmlearn** | Hidden Markov Model implementation |
| **NumPy / Pandas** | Time-series data manipulation |

### Backend
| Technology | Use |
|-----------|-----|
| **FastAPI**| REST API gateway (Python) |
| **SQLAlchemy**| ORM for SQLite trade journaling |
| **Uvicorn**| ASGI server |

### Frontend
| Technology | Use |
|-----------|-----|
| **Vanilla HTML5/JS**| Ultra-lightweight UI framework |
| **Tailwind CSS**| Utility-first styling with custom glassmorphism |
| **Apache ECharts**| Institutional-grade canvas charting |
| **Stitch MCP**| AI-generated UI component synthesis |

---

## Quick Start

### Prerequisites
- Python 3.11+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/YourOrg/MRDS.project.git
cd MRDS.project
```

### 2. Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend API docs available at: `http://localhost:8000/docs`

### 3. Start the Frontend
In a new terminal window:
```bash
cd frontend
python -m http.server 3000
```
Navigate to `http://localhost:3000` to view the unified terminal.

---

## Project Structure

```text
MRDS.project/
│
├── backend/                        # FastAPI Python backend
│   ├── main.py                     # API entry point & CORS
│   ├── database.py                 # SQLite ORM & Schema
│   └── requirements.txt            # Python dependencies
│
├── frontend/                       # Vanilla JS + Tailwind Frontend
│   ├── index.html                  # Landing Page
│   ├── dashboard.html              # Main Quant Terminal
│   ├── signin.html                 # Authentication (Login)
│   ├── signup.html                 # Authentication (Register)
│   ├── market-heatmap.html         # Macro Heatmap View
│   ├── multi-asset-overlay.html    # Cross-Asset Correlation View
│   ├── app.js                      # UI Controller & Router
│   ├── regimeEngine.js             # HMM Math & ECharts Logic
│   ├── paperTrading.js             # Local Execution Engine
│   ├── aiBot.js                    # Terminal AI Copilot UI
│   ├── alertsManager.js            # Notification System
│   └── styles.css                  # Core CSS & Glassmorphism
│
├── index.html                      # Root redirect router
└── README.md                       # This file
```

---

## Demo Scenarios

### Scenario 1: The Regime Shift
**Story**: Market transitions from a low-volatility Bullish state to a High Volatility state following a macro news event.
1. `regimeEngine.js` detects the volatility spike and updates the HMM probabilities.
2. The UI flashes a red system alert via `alertsManager.js`.
3. The AI Quant Copilot autonomously recommends rotating out of long tech equities and scaling into cash or volatility derivatives.

---

## Security & Compliance
- **Data Privacy**: All paper-trading data is localized to the user's browser or secured SQLite instance.
- **CORS Restricted**: API explicitly controls origins for secure frontend-backend communication.
- **End-to-End Authentication**: Modular sign-in/sign-up flows ready for OAuth integration.

---

## Scalability
The decoupled frontend (Vanilla JS) and backend (FastAPI) allow the platform to be horizontally scaled or deployed via Edge Networks (Vercel/Cloudflare) and Kubernetes for institutional load.

---

## License
This project is licensed under the MIT License.

---

<div align="center">

**RegimeSense — Because reacting to the market is already too late.**

*Identify the state. Exploit the edge. Protect the downside.*

</div>
