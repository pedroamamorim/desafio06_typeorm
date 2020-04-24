import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';
import ImportTransactionsService from '../services/ImportTransactionsService';
// instanciando o multer (middleware)
const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO
  // instanciamos nosso repositório
  // criamos o repósitório custom com todos os métodos de tabela
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  // procurar transações com typeORM. Como não passamos nenhuma condição ele vai
  // nos retornar todas as transações
  const transactions = await transactionsRepository.find();
  // executar o balanço
  const balance = await transactionsRepository.getBalance();
  // retornamos um objeto com as transações e balanço
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  // recebemos os dados da request
  const { title, value, type, category } = request.body;
  // não precisaremos transformar os dados
  // criamos o serviço de criação de transações (instância)
  const createTransaction = new CreateTransactionService();
  // criamos a transação. Executamos o Service. A tipagem dos parâmetros vem da
  // função execute, que vem da interface
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  // desestruturar o id
  const { id } = request.params;
  // criamos o service
  const deleteTransaction = new DeleteTransactionService();
  // executa serviço de deletar com o id que foi passado
  await deleteTransaction.execute(id);

  return response.status(204).send();
});

// adicionando o middleware a execução será, rota import, middleware de upload, função
transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // TODO
    // instanciando o service de upload
    const importTransactions = new ImportTransactionsService();
    // executa o service
    const transactions = await importTransactions.execute(request.file.path);

    return response.json(transactions);
  },
);

export default transactionsRouter;
