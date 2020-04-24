// import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

// criamos a interface com a tipagem
interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    // TODO

    // criamos o repósitório custom com todos os métodos de tabela
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // regra de negócio
    // 1-verifica se tem saldo suficiente para a transação
    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You dont have enough balance');
    }
    // 2-verificar se categoria existe. Se existir, procurar no banco de dados.
    // Se não existir. Criar ela no banco de dados

    // criamos um repositório baseado no nosso model e com os métodos de tabela
    const categoryRepository = getRepository(Category);
    // verificar se categoria existe
    let uniqueCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    // Se não existir, criaremos a categoria
    if (!uniqueCategory) {
      uniqueCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(uniqueCategory);
    }

    // salvamos repositório no array
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: uniqueCategory,
    });

    // salvamos no banco de dados
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
