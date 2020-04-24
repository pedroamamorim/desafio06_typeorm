import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // TODO
    // avaliamos se o id existe. Se existir, nós deletamos, senão retornamos um erro
    // criamos o repósitório custom
    const transactionsRepository = getCustomRepository(TransactionRepository);
    // procuramos pelo id
    const transaction = await transactionsRepository.findOne(id);
    // se não encontrar
    if (!transaction) {
      throw new AppError('Transaction does not exist');
    }
    // Se encontrar
    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
