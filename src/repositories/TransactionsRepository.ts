import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

// entidade do repositorio que recebe modelo transaction
@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    // pegar todas as transações do banco de dados
    const transactions = await this.find();
    // calcular balanço com reduce. Lembrando que valor inicial é importante para
    // definir o tipo do acumulador
    /* jogamos o cálculo ou em uma constante (ex: balance) ou em elementos
    desestruturados de dentro do reduce (ex: income e outcome)
    depois resgatamos eles (ex: balance.income ou income)
    */
    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            // transaction.value vem como string do banco de dados, então transformamos em número
            accumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            // transaction.value vem como string do banco de dados, então transformamos em número
            accumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
