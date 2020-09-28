import { LightningElement, track } from "lwc";
import getBitcoinRates from "@salesforce/apex/BitcoinConverter.getBitcoinConverstionRates";

export default class BitcoinToUsdConverter extends LightningElement {
  @track currencies;
  labelToDisplay;
  bitcoinValue;
  selectedCurrency;
  selectedLabel;
  bitcoinValueInSelectedCurrency;
  valueOfOneBitcoin;

  connectedCallback() {
    getBitcoinRates()
      .then((listOfCurrencies) => {
        this.setCurrencies(JSON.parse(listOfCurrencies));
        this.setDefaultValues();
      })
      .catch((err) => console.log(err));
  }

  handleCurrencySelection(event) {
    this.selectedCurrency = parseFloat(event.detail.value);
    this.valueOfOneBitcoin = parseFloat(event.detail.value);
    this.bitcoinValueInSelectedCurrency =
      this.bitcoinValue * this.valueOfOneBitcoin;
    this.selectedLabel = event.target.options.find(
      (opt) => opt.value === parseFloat(event.detail.value)
    ).label;
    this.labelToDisplay = "Bitcoin value in " + this.selectedLabel;
  }

  setDefaultValues() {
    this.labelToDisplay = "Bitcoin value in US Dollar";
    this.bitcoinValue = 1;
    this.valueOfOneBitcoin = this.currencies.find(
      (cur) => cur.label === "US Dollar"
    ).value;
    this.selectedCurrency = this.valueOfOneBitcoin;
    this.setBitcoinValueInSelectedCurrency();
  }

  handleUpdate(event) {
    if (event.target.name === "bitcoinValue") {
      this.bitcoinValue = parseFloat(event.detail.value);
      this.setBitcoinValueInSelectedCurrency();
    } else if (event.target.name === "valueInCurrency") {
      this.bitcoinValueInSelectedCurrency = parseFloat(event.detail.value);
      this.bitcoinValue =
        this.bitcoinValueInSelectedCurrency / this.valueOfOneBitcoin;
    }
  }

  setBitcoinValueInSelectedCurrency() {
    this.bitcoinValueInSelectedCurrency =
      this.bitcoinValue * this.valueOfOneBitcoin;
  }

  setCurrencies(listOfCurrencies) {
    this.currencies = [];
    listOfCurrencies.forEach((currency) => {
      let ob = {};
      ob.label = currency.name;
      ob.value = currency.rate;
      this.currencies.push(ob);
    });
  }
}
