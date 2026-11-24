const pool = require("../config/db");

const findAllByUser = async (userId, type, month) => {
    let sql = `SELECT t.id, t.type, t.amount, t.description, t.date,
                      t.category_id AS categoryId, c.name AS categoryName
               FROM transactions t
               JOIN categories c ON c.id = t.category_id
               WHERE t.user_id = ?`;
    const params = [userId];

    if (type) {
        sql += " AND t.type = ?";
        params.push(type);
    }

    if (month) {
        sql += " AND DATE_FORMAT(t.date, '%Y-%m') = ?";
        params.push(month);
    }

    sql += " ORDER BY t.date DESC, t.id DESC;";

    const [rows] = await pool.execute(sql, params);

    return rows;
};

const findById = async (id, userId) => {
    const [rows] = await pool.execute(
        `SELECT t.id, t.type, t.amount, t.description, t.date,
                t.category_id AS categoryId, c.name AS categoryName
         FROM transactions t
         JOIN categories c ON c.id = t.category_id
         WHERE t.id = ? AND t.user_id = ?;`,
        [id, userId]
    );

    return rows[0];
};

const create = async (userId, categoryId, type, amount, description, date) => {
    const [result] = await pool.execute(
        `INSERT INTO transactions (user_id, category_id, type, amount, description, date)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [userId, categoryId, type, amount, description, date]
    );

    return result;
};

const update = async (id, userId, categoryId, type, amount, description, date) => {
    const [result] = await pool.execute(
        `UPDATE transactions
         SET category_id = ?, type = ?, amount = ?, description = ?, date = ?
         WHERE id = ? AND user_id = ?;`,
        [categoryId, type, amount, description, date, id, userId]
    );

    return result;
};

const remove = async (id, userId) => {
    const [result] = await pool.execute(
        "DELETE FROM transactions WHERE id = ? AND user_id = ?;",
        [id, userId]
    );

    return result;
};

const getTotals = async (userId, month) => {
    let sql = "SELECT type, SUM(amount) AS total FROM transactions WHERE user_id = ?";
    const params = [userId];

    if (month) {
        sql += " AND DATE_FORMAT(date, '%Y-%m') = ?";
        params.push(month);
    }

    sql += " GROUP BY type;";

    const [rows] = await pool.execute(sql, params);

    return rows;
};

const getExpensesByCategory = async (userId, month) => {
    let sql = `SELECT c.name, SUM(t.amount) AS total
               FROM transactions t
               JOIN categories c ON c.id = t.category_id
               WHERE t.user_id = ? AND t.type = 'expense'`;
    const params = [userId];

    if (month) {
        sql += " AND DATE_FORMAT(t.date, '%Y-%m') = ?";
        params.push(month);
    }

    sql += " GROUP BY c.id, c.name ORDER BY total DESC;";

    const [rows] = await pool.execute(sql, params);

    return rows;
};

module.exports = {
    findAllByUser,
    findById,
    create,
    update,
    remove,
    getTotals,
    getExpensesByCategory,
};
