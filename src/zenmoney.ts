import { Transaction } from '../index';
import { Logger } from './logger';

export enum Currency {
  BYN = 'BYN',
  USD = 'USD'
}

export enum TransactionType {
  INCOME = 'income',
  OUTCOME = 'outcome',
  TRANSFER = 'transfer',
  EXCHANGE = 'exchange'
}

export interface SumByCategory {
  [key: string]: {
    [key: string]: number;
  }
}

export abstract class Zenmoney {
  protected readonly CORRECTION_CATEGORY = 'Корректировка';
  protected readonly TOTAL_CATEGORY = 'Итого';
  protected readonly transactions: Transaction[];

  public constructor(transactions: Transaction[]) {
    this.transactions = this.filterTransactions(transactions);
  }

  protected filterTransactions(transactions): Transaction[] {
    return transactions.filter(transaction => this.isNotCorrection(transaction) &&
       this.getTransactionTypes().includes(this.detectTransactionType(transaction)));
  }

  protected isNotCorrection(transaction: Transaction): boolean {
    return transaction.categoryName !== this.CORRECTION_CATEGORY;
  }

  protected detectTransactionType(transaction: Transaction): TransactionType {
    if (this.isOutcome(transaction)) {
      return TransactionType.OUTCOME;
    }

    if (this.isIncome(transaction)) {
      return TransactionType.INCOME;
    }

    if (this.isExchange(transaction)) {
      return TransactionType.EXCHANGE;
    }

    if (this.isTransfer(transaction)) {
      return TransactionType.TRANSFER;
    }

    console.log('error', JSON.stringify(transaction, null, 4));
    throw new Error('Can not detect type of transaction');
  }

  protected isOutcome(transaction: Transaction): boolean {
    return !!(this.priceToNumber(transaction.outcome) && !this.priceToNumber(transaction.income));
  }

  protected isIncome(transaction: Transaction): boolean {
    return !!(!this.priceToNumber(transaction.outcome) && this.priceToNumber(transaction.income));
  }

  protected isExchange(transaction: Transaction): boolean {
    return this.priceToNumber(transaction.outcome) && this.priceToNumber(transaction.income) &&
      transaction.incomeCurrencyShortTitle !== transaction.outcomeCurrencyShortTitle;
  }

  protected isTransfer(transaction: Transaction): boolean {
    return this.priceToNumber(transaction.outcome) && this.priceToNumber(transaction.income) &&
      transaction.incomeCurrencyShortTitle === transaction.outcomeCurrencyShortTitle;
  }

  protected priceToNumber(price: string): number {
    return parseFloat(price.replace(/,/, '.'));
  }

  protected abstract getTransactionTypes(): TransactionType[];

  public calculateAndRender(title: string): void {
    new Logger().log(title, this.calculate());
  }

  protected calculate(): SumByCategory {
    const result = {};

    const categories = this.getCategories();
    const currencies = this.getCurrencies();

    for (const currency of currencies) {
      let totalSum = 0;

      for (const category of categories) {
        const sumByCategory = this.calculateSum(category, currency);
        result[category] = {
          ...result[category] || {},
          [currency]: sumByCategory
        };
        totalSum += sumByCategory;
      }

      result[this.TOTAL_CATEGORY] = {
        ...result[this.TOTAL_CATEGORY] || {},
        [currency]: totalSum
      }
    }

    return result;
  }

  protected getCategories(): string[] {
    return <string[]>[...new Set(this.transactions.map(({ categoryName }) => categoryName))];
  }

  protected getCurrencies(): Currency[] {
    const currencies = this.transactions.map(({ outcomeCurrencyShortTitle, incomeCurrencyShortTitle}) =>
      [outcomeCurrencyShortTitle, incomeCurrencyShortTitle]);
    return <Currency[]>[...new Set([].concat.apply([], currencies))];
  }

  protected calculateSum(category: string, currency: Currency): number {
    const result = this.transactions
      .filter(({ categoryName, outcomeCurrencyShortTitle }) =>
        categoryName === category && outcomeCurrencyShortTitle === currency)
      .reduce((accumulator, item) => accumulator + this.priceToNumber(item.outcome), 0);
    return Math.round(result);
  }
}
