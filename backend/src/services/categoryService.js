const categoryRepository = require("../repositories/categoryRepository");
const AppError = require("../utils/AppError");

const TYPES = ["income", "expense"];

const getAll = async (userId) => {
    return categoryRepository.findAllByUser(userId);
};

const create = async (userId, name, type) => {
    if (!name || !name.trim()) {
        throw new AppError("Category name is required", 400);
    }

    if (!TYPES.includes(type)) {
        throw new AppError("Type must be income or expense", 400);
    }

    try {
        const result = await categoryRepository.create(userId, name.trim(), type);
        return {id: result.insertId, name: name.trim(), type};
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            throw new AppError("Category already exists", 409);
        }
        throw err;
    }
};

const update = async (id, userId, name) => {
    if (!name || !name.trim()) {
        throw new AppError("Category name is required", 400);
    }

    try {
        const result = await categoryRepository.update(id, userId, name.trim());

        if (result.affectedRows === 0) {
            throw new AppError("Category not found", 404);
        }
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            throw new AppError("Category already exists", 409);
        }
        throw err;
    }

    return categoryRepository.findById(id, userId);
};

const remove = async (id, userId) => {
    try {
        const result = await categoryRepository.remove(id, userId);

        if (result.affectedRows === 0) {
            throw new AppError("Category not found", 404);
        }
    } catch (err) {
        if (err.code === "ER_ROW_IS_REFERENCED_2") {
            throw new AppError("Cannot delete a category that has transactions", 409);
        }
        throw err;
    }
};

module.exports = {getAll, create, update, remove};
