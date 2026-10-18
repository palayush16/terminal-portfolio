// ═══════════════════════════════════════════════════
//  Google Analytics 4 — event tracking
//  GA4 Property: G-Z1Y0G16RCM
// ═══════════════════════════════════════════════════

function trackEvent(name, params) {
  if (typeof gtag === 'function') {
    gtag('event', name, params || {});
  }
}
