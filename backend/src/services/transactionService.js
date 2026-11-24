const transactionRepository = require("../repositories/transactionRepository");
const categoryRepository = require("../repositories/categoryRepository");
const AppError = require("../utils/AppError");

const TYPES = ["income", "expense"];
const DATE_REGEXP = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_REGEXP = /^\d{4}-\d{2}$/;

const validate = async (userId, data) => {
    const {categoryId, type, amount, date} = data;

    if (!TYPES.includes(type)) {
        throw new AppError("Type must be income or expense", 400);
    }

    if (typeof amount !== "number" || !(amount > 0) || amount >= 10000000000) {
        throw new AppError("Amount must be a positive number", 400);
    }

    if (!DATE_REGEXP.test(date)) {
        throw new AppError("Date must be in YYYY-MM-DD format", 400);
    }

    const category = await categoryRepository.findById(categoryId, userId);

    if (!category) {
        throw new AppError("Category not found", 400);
    }

    if (category.type !== type) {
        throw new AppError("Category type does not match transaction type", 400);
    }
};

const checkMonth = (month) => {
    if (month && !MONTH_REGEXP.test(month)) {
        throw new AppError("Month must be in YYYY-MM format", 400);
    }
};

const getAll = async (userId, type, month) => {
    checkMonth(month);

    if (type && !TYPES.includes(type)) {
        throw new AppError("Type must be income or expense", 400);
    }

    return transactionRepository.findAllByUser(userId, type, month);
};

const create = async (userId, data) => {
    await validate(userId, data);

    const {categoryId, type, amount, description, date} = data;

    const result = await transactionRepository.create(
        userId, categoryId, type, amount, description || null, date
    );

    return transactionRepository.findById(result.insertId, userId);
};

const update = async (id, userId, data) => {
    await validate(userId, data);

    const {categoryId, type, amount, description, date} = data;

    const result = await transactionRepository.update(
        id, userId, categoryId, type, amount, description || null, date
    );

    if (result.affectedRows === 0) {
        throw new AppError("Transaction not found", 404);
    }

    return transactionRepository.findById(id, userId);
};

const remove = async (id, userId) => {
    const result = await transactionRepository.remove(id, userId);

    if (result.affectedRows === 0) {
        throw new AppError("Transaction not found", 404);
    }
};

const getSummary = async (userId, month) => {
    checkMonth(month);

    const totals = await transactionRepository.getTotals(userId, month);
    const expensesByCategory = await transactionRepository.getExpensesByCategory(userId, month);

    let income = 0;
    let expense = 0;

    totals.forEach((row) => {
        if (row.type === "income") income = row.total;
        if (row.type === "expense") expense = row.total;
    });

    return {income, expense, balance: income - expense, expensesByCategory};
};

module.exports = {getAll, create, update, remove, getSummary};
