const transactionService = require("../services/transactionService");

const getAll = async (req, res) => {
    const {type, month} = req.query;
    const transactions = await transactionService.getAll(req.userId, type, month);
    res.json(transactions);
};

const getSummary = async (req, res) => {
    const summary = await transactionService.getSummary(req.userId, req.query.month);
    res.json(summary);
};

const create = async (req, res) => {
    const transaction = await transactionService.create(req.userId, req.body);
    res.status(201).json(transaction);
};

const update = async (req, res) => {
    const transaction = await transactionService.update(Number(req.params.id), req.userId, req.body);
    res.json(transaction);
};

const remove = async (req, res) => {
    await transactionService.remove(Number(req.params.id), req.userId);
    res.status(204).end();
};

module.exports = {getAll, getSummary, create, update, remove};
