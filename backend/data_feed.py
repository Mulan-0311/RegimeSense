import yfinance as yf
import pandas as pd

def get_live_market_data(symbol: str = "^NSEI", period: str = "1Y"):
    """
    Fetches real-time or near real-time data for Indian stocks.
    Example symbols:
    - NIFTY 50: ^NSEI
    - Reliance: RELIANCE.NS
    - HDFC Bank: HDFCBANK.NS
    """
    try:
        ticker = yf.Ticker(symbol)
        
        # map frontend periods to yfinance periods
        yf_period = "1y"
        if period == "3M": yf_period = "3mo"
        elif period == "1Y": yf_period = "1y"
        elif period == "3Y": yf_period = "3y"
        elif period == "5Y": yf_period = "5y"

        data = ticker.history(period=yf_period)
        
        if data.empty:
            return {"status": "error", "message": "Market might be closed or symbol invalid.", "symbol": symbol}
        
        dates = [d.strftime('%Y-%m-%d') for d in data.index]
        prices = [round(float(p), 2) for p in data['Close']]
        volumes = [int(v) for v in data['Volume']]
        
        # calculate daily returns
        returns = [0]
        for i in range(1, len(prices)):
            returns.append((prices[i] - prices[i-1]) / prices[i-1])
            
        return {
            "status": "success",
            "symbol": symbol,
            "period": period,
            "dates": dates,
            "prices": prices,
            "returns": returns,
            "volumes": volumes,
            "latest_price": prices[-1],
            "latest_volume": volumes[-1]
        }
    except Exception as e:
        return {"status": "error", "message": str(e), "symbol": symbol}
