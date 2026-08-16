/**
 * ALERTS-MANAGER.JS
 * Evaluates regime shifts and triggers market alerts
 */

window.AlertsManager = (function() {
  'use strict';

  let alertQueue = [];
  const subscribers = [];

  // Load saved alerts
  const saved = localStorage.getItem('regimeSense_alerts');
  if (saved) {
    try {
      alertQueue = JSON.parse(saved);
    } catch(e) {}
  }

  function subscribe(callback) {
    subscribers.push(callback);
  }

  function notify(alert) {
    subscribers.forEach(cb => cb(alert));
  }

  function evaluateRegimeShift(previousRegime, currentRegime, marketData) {
    if (previousRegime && previousRegime.id !== currentRegime.id) {
      const alert = {
        id: Date.now().toString(),
        type: currentRegime.code === 'BEAR' || currentRegime.code === 'SHOCK' ? 'danger' : 
              currentRegime.code === 'SIDE' ? 'warning' : 'success',
        title: `Regime Shift Detected: ${currentRegime.name}`,
        desc: `System has identified a transition from ${previousRegime.name}. Recommend tactical re-allocation.`,
        time: new Date().toISOString(),
        read: false
      };
      
      addAlert(alert);
    }
  }

  function evaluateVolatility(currentVol, historicalVol) {
    if (currentVol > historicalVol * 1.5) {
      addAlert({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Volatility Expansion',
        desc: `Realized volatility has spiked to ${(currentVol * 100).toFixed(1)}%. Risk limits breached.`,
        time: new Date().toISOString(),
        read: false
      });
    }
  }

  function addAlert(alert) {
    alertQueue.unshift(alert);
    if (alertQueue.length > 50) alertQueue.pop(); // Keep last 50
    localStorage.setItem('regimeSense_alerts', JSON.stringify(alertQueue));
    notify(alert);
  }

  function getUnreadCount() {
    return alertQueue.filter(a => !a.read).length;
  }

  function markAllRead() {
    alertQueue.forEach(a => a.read = true);
    localStorage.setItem('regimeSense_alerts', JSON.stringify(alertQueue));
  }

  return {
    getAlerts: () => alertQueue,
    subscribe,
    evaluateRegimeShift,
    evaluateVolatility,
    addAlert,
    getUnreadCount,
    markAllRead
  };
})();
