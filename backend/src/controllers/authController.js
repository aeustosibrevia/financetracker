const userService = require("../services/userService");

const register = async (req, res) => {
    const {name, email, password} = req.body;
    const data = await userService.register(name, email, password);
    res.status(201).json(data);
};

const login = async (req, res) => {
    const {email, password} = req.body;
    const data = await userService.login(email, password);
    res.json(data);
};

module.exports = {register, login};
