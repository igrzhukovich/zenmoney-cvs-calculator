import { parseFile } from '@fast-csv/parse';
import { Outcome } from './src/outcome';
import { Income } from './src/income';
import { Exchange } from './src/exchange';
import { Profit } from './src/profit';

export interface Transaction {
  date: string;
  categoryName: string;
  payee: string;
  comment: string;
  outcomeAccountName: string;
  outcome: string;
  outcomeCurrencyShortTitle: string;
  incomeAccountName: string;
  income: string;
  incomeCurrencyShortTitle: string;
  createdDate: string;
  changedDate: string;
  qrCode: string;
}

  interface ParsedTransactions {
  [key: string]: Transaction[];
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const data: ParsedTransactions = {};

const stream = parseFile('./data/zen_2020-09-28_10884FCB.csv', {
  delimiter: ';',
  headers: true
})
  .on('error', error => console.error(error))
  .on('data', row => {
    const createdAt = new Date(row.date);
    const key = monthNames[createdAt.getMonth()] + ' ' + createdAt.getFullYear();
    data[key] ? data[key].push(row) : data[key] = [];
  })
  .on('end', () => {
    const transactionsForLastMonth = data[Object.keys(data).pop()];
    new Outcome(transactionsForLastMonth).calculateAndRender('Расход');
    new Income(transactionsForLastMonth).calculateAndRender('Доход');
    new Exchange(transactionsForLastMonth).calculateAndRender('Обмен');
    new Profit(transactionsForLastMonth).calculateAndRender('Чистый доход');
  });
