const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const categoryRepository = require("../repositories/categoryRepository");
const AppError = require("../utils/AppError");

const createToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
};

const register = async (name, email, password) => {
    if (!name || !email || !password) {
        throw new AppError("Name, email and password are required", 400);
    }

    if (password.length < 6) {
        throw new AppError("Password must be at least 6 characters", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await userRepository.findUserByEmail(normalizedEmail);

    if (existingUser) {
        throw new AppError("User with this email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await userRepository.createUser(name.trim(), normalizedEmail, passwordHash);
    const userId = result.insertId;

    await categoryRepository.createDefaults(userId);

    return {
        token: createToken(userId),
        user: {id: userId, name: name.trim(), email: normalizedEmail},
    };
};

const login = async (email, password) => {
    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await userRepository.findUserByEmail(normalizedEmail);

    if (!user) {
        throw new AppError("Wrong email or password", 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
        throw new AppError("Wrong email or password", 401);
    }

    return {
        token: createToken(user.id),
        user: {id: user.id, name: user.name, email: user.email},
    };
};

module.exports = {register, login};
