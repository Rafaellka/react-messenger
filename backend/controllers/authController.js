const pool = require("../db");
const bcrypt = require("bcrypt");

const getUsers = async (avoidName) => {
    const response = await pool.query("SELECT username FROM users WHERE username != $1", [avoidName]);
    const users = response.rows.map(user => ({
        userName: user.username
    }));
    return users;
};

module.exports.handleLogin = async (req, res) => {
    if (!req.session.user || !req.session.user.userName) {
        return res.json({
            loggedIn: false
        });
    }
    const userName = req.session.user.userName;
    const users = await getUsers(userName);

    res.json({
        loggedIn: true,
        userName,
        users
    });
};

module.exports.tryToLogin = async (req, res) => {
    const {userName, password} = req.body;
    const potentialLogin = await pool.query(
        "SELECT passhash FROM users WHERE username=$1",
        [userName]
    );

    if (potentialLogin.rowCount === 0) {
        return res.json({
            loggedIn: false,
            status: "⚠ Неправильный никнейм или пароль!",
            userName
        });
    }

    const {passhash} = potentialLogin.rows[0];
    const isSamePass = await bcrypt.compare(password, passhash);


    if (!isSamePass) {
        return res.json({
            loggedIn: false,
            status: "⚠ Неправильный пароль!",
            userName
        });
    }

    const users = await getUsers(userName);
    console.log(users)
    req.session.users = users;
    req.session.user = {
        userName
    };

    res.json({
        loggedIn: true,
        userName,
        users
    });
};


module.exports.tryToRegister = async (req, res) => {
    const {userName, password} = req.body;
    const existingUser = await pool.query(
        `SELECT username
         from users
         WHERE username = $1`,
        [userName]
    );

    if (existingUser.rowCount > 0) {
        return res.json({
            loggedIn: false,
            status: "⚠ Никнейм занят"
        });
    }

    const passHash = await bcrypt.hash(password, 7);
    await pool.query(
        `INSERT INTO users(username, passhash)
         VALUES ($1, $2)`,
        [userName, passHash]
    );

    const users = await getUsers(userName);

    req.session.user = {
        userName
    }

    res.json({
        loggedIn: true,
        userName,
        users
    });
};
