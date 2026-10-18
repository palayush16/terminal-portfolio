// ═══════════════════════════════════════════════════
//  Google Analytics 4 — event tracking
//  GA4 Property: G-Z1Y0G16RCM
// ═══════════════════════════════════════════════════

function trackEvent(name, params) {
  const payload = Object.assign({ debug_mode: true }, params || {});
  console.log('[GA4 Event]:', name, payload);
  if (typeof gtag === 'function') {
    gtag('event', name, payload);
  }
}
