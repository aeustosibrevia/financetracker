const pool = require("../config/db");

const createUser = async (name, email, password) => {
    const [result] = await pool.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?);",
        [name, email, password]
    );

    return result;
}

const findUserByEmail = async (email) => {
    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE email = ?;",
        [email]
    );

    return rows[0];
}

module.exports = {createUser, findUserByEmail};
