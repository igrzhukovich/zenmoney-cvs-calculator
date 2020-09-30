import { Currency, SumByCategory } from './zenmoney';

export class Logger {
  private result = {};

  public log(title: string, categories: SumByCategory): void {
    for (const category of Object.keys(categories)) {
      if (typeof categories[category] !== 'object') {
        this.result[category] = categories[category];
        continue;
      }

      for (const currency of Object.keys(categories[category])) {
        if (categories[category][currency]) {
          this.result[category] = {
            ...this.result[category] || {},
            [currency]: categories[category][currency]
          }
        }
      }

      if (this.onlyBynInCategory(category)) {
        this.result[category] = this.result[category][Currency.BYN];
      }
    }

    console.log(title + ' ' + JSON.stringify(this.result, null, 4));
  }

  private onlyBynInCategory(category): boolean {
    const hasCategory = this.result[category];
    const hasBYN = hasCategory && this.result[category][Currency.BYN];
    const oneItemInCategory = hasCategory && Object.keys(this.result[category]).length === 1;
    return hasCategory && hasBYN && oneItemInCategory;
  }
}
