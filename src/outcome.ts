import { TransactionType, Zenmoney } from './zenmoney';

export class Outcome extends Zenmoney {
  protected getTransactionTypes(): TransactionType[] {
    return [TransactionType.OUTCOME];
  }
}
