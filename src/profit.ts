import { SumByCategory, TransactionType, Zenmoney } from './zenmoney';

export class Profit extends Zenmoney {
  protected getTransactionTypes(): TransactionType[] {
    return [
      TransactionType.INCOME,
      TransactionType.OUTCOME,
      TransactionType.EXCHANGE
    ];
  }

  protected calculate(): SumByCategory {
    const result = {};
    const currencies = this.getCurrencies();
    for (const currency of currencies) {
      const incomeSum = this.transactions
        .filter(transaction => this.isIncome(transaction) && transaction.incomeCurrencyShortTitle === currency)
        .reduce((accumulator, item) => accumulator + this.priceToNumber(item.income), 0);
      const outcomeSum = this.transactions
        .filter(transaction => this.isOutcome(transaction) && transaction.outcomeCurrencyShortTitle === currency)
        .reduce((accumulator, item) => accumulator + this.priceToNumber(item.outcome), 0);
      const incomeExchangeSum = this.transactions
        .filter(transaction => this.isExchange(transaction) && transaction.incomeCurrencyShortTitle === currency)
        .reduce((accumulator, item) => accumulator + this.priceToNumber(item.income), 0);
      const outcomeExchangeSum = this.transactions
        .filter(transaction => this.isExchange(transaction) && transaction.outcomeCurrencyShortTitle === currency)
        .reduce((accumulator, item) => accumulator + this.priceToNumber(item.outcome), 0);
      result[currency] = Math.round((incomeSum + incomeExchangeSum) - (outcomeSum + outcomeExchangeSum));
    }
    return result;
  }
}
