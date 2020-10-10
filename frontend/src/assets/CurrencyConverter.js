export default class CurrencyConverter {
  static convertToSwedishCurr(number) {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
    }).format(number);
  }
}
