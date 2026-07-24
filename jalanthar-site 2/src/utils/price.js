// Formats a gp value into a clean gp/sp/cp display string.
export function formatPrice(gp) {
  if (gp == null || Number.isNaN(gp)) return '—'
  if (gp >= 1) {
    const rounded = Math.round(gp * 100) / 100
    return `${rounded % 1 === 0 ? rounded : rounded.toFixed(2)} gp`
  }
  if (gp >= 0.1) {
    const sp = Math.round(gp * 10)
    return `${sp} sp`
  }
  const cp = Math.round(gp * 100)
  return `${cp} cp`
}

// Effective price for a catalog-backed item row, respecting a manual
// per-item override if the DM has set one, otherwise applying the
// building's price multiplier to the base price.
export function effectivePrice(row, multiplier) {
  if (row.priceOverride != null && row.priceOverride !== '') {
    return Number(row.priceOverride)
  }
  return (row.basePrice ?? 0) * (multiplier ?? 1)
}
