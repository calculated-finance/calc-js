// Extend the Number interface with your custom method
interface Number {
  toLocaleDecimal: (decimals: number, shrink?: boolean) => string;
}

// Add the method to the Number prototype
Number.prototype.toLocaleDecimal = function (decimals = 0, shrink = false): string {
  return this.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: shrink ? 0 : decimals,
  });
};