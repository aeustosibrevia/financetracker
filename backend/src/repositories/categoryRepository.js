const pool = require("../config/db");

const DEFAULT_CATEGORIES = [
    ["Food", "expense"],
    ["Transport", "expense"],
    ["Housing", "expense"],
    ["Entertainment", "expense"],
    ["Health", "expense"],
    ["Salary", "income"],
    ["Gifts", "income"],
];

const findAllByUser = async (userId) => {
    const [rows] = await pool.execute(
        "SELECT id, name, type FROM categories WHERE user_id = ? ORDER BY type, name;",
        [userId]
    );

    return rows;
};

const findById = async (id, userId) => {
    const [rows] = await pool.execute(
        "SELECT id, name, type FROM categories WHERE id = ? AND user_id = ?;",
        [id, userId]
    );

    return rows[0];
};

const create = async (userId, name, type) => {
    const [result] = await pool.execute(
        "INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?);",
        [userId, name, type]
    );

    return result;
};

const update = async (id, userId, name) => {
    const [result] = await pool.execute(
        "UPDATE categories SET name = ? WHERE id = ? AND user_id = ?;",
        [name, id, userId]
    );

    return result;
};

const remove = async (id, userId) => {
    const [result] = await pool.execute(
        "DELETE FROM categories WHERE id = ? AND user_id = ?;",
        [id, userId]
    );

    return result;
};

const createDefaults = async (userId) => {
    const values = DEFAULT_CATEGORIES.map(([name, type]) => [userId, name, type]);

    await pool.query(
        "INSERT INTO categories (user_id, name, type) VALUES ?;",
        [values]
    );
};

module.exports = {findAllByUser, findById, create, update, remove, createDefaults};
