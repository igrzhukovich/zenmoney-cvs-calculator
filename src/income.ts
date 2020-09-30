import { Currency, TransactionType, Zenmoney } from './zenmoney';

export class Income extends Zenmoney {
  protected getTransactionTypes(): TransactionType[] {
    return [TransactionType.INCOME];
  }

  protected calculateSum(category: string, currency: Currency): number {
    const result = this.transactions
      .filter(({ categoryName, incomeCurrencyShortTitle }) =>
        categoryName === category && incomeCurrencyShortTitle === currency)
      .reduce((accumulator, item) => accumulator + this.priceToNumber(item.income), 0);
    return Math.round(result);
  }
}
