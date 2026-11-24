const categoryService = require("../services/categoryService");

const getAll = async (req, res) => {
    const categories = await categoryService.getAll(req.userId);
    res.json(categories);
};

const create = async (req, res) => {
    const {name, type} = req.body;
    const category = await categoryService.create(req.userId, name, type);
    res.status(201).json(category);
};

const update = async (req, res) => {
    const category = await categoryService.update(Number(req.params.id), req.userId, req.body.name);
    res.json(category);
};

const remove = async (req, res) => {
    await categoryService.remove(Number(req.params.id), req.userId);
    res.status(204).end();
};

module.exports = {getAll, create, update, remove};
