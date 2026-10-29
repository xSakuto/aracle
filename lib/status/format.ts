// Prozent mit zwei Stellen, ohne aufzurunden (99.999 % ist nicht 100 %)
export const pct = (v: number) =>
  `${(Math.floor(v * 10000) / 100).toLocaleString("de-CH", { minimumFractionDigits: v < 1 ? 2 : 0 })} %`;
