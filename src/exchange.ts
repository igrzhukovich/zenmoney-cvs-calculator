import { SumByCategory, TransactionType, Zenmoney } from './zenmoney';

export class Exchange extends Zenmoney {
  protected getTransactionTypes(): TransactionType[] {
    return [TransactionType.EXCHANGE];
  }

  protected calculate(): SumByCategory {
    const result = {};

    const currencies = this.getCurrencies();
    for (const outcomeCurrency of currencies) {
      for (const incomeCurrency of currencies) {
        if (outcomeCurrency === incomeCurrency) {
          continue;
        }

        const filteredTransactions = this.transactions.filter(({ outcomeCurrencyShortTitle, incomeCurrencyShortTitle}) =>
          outcomeCurrencyShortTitle === outcomeCurrency && incomeCurrencyShortTitle === incomeCurrency);
        const outcomeSum = filteredTransactions.reduce((accumulator, item) => accumulator + this.priceToNumber(item.outcome), 0);
        const incomeSum = filteredTransactions.reduce((accumulator, item) => accumulator + this.priceToNumber(item.income), 0);
        const categoryKey = outcomeCurrency + '-' + incomeCurrency;
        result[categoryKey] = {
          [outcomeCurrency]: outcomeSum,
          [incomeCurrency]: incomeSum
        };
      }
    }

    return result;
  }
}
