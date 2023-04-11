const pool = require('../db');

module.exports.handleMessages = async (req, res) => {
    const {id} = req.params;
    const userName = req.session.user.userName;
    const queryId = [userName, id].sort().join('-with-');
    const messages = await pool.query('SELECT messages FROM dialogs WHERE id = $1', [queryId]);
    if (messages.rows.length === 0) {
        await pool.query('INSERT INTO dialogs(id, messages) VALUES ($1, $2)', [queryId, '[]']);
        return res.json({
            messages: []
        });
    }

    res.json({
        messages: messages.rows[0].messages
    })
};

module.exports.getNewMessage = async (req, res) => {
    const {id} = req.params;
    const userName = req.session.user.userName;
    const newMessage = {
        value: req.body.message,
        from: userName
    };
    const queryId = [userName, id].sort().join('-with-');
    const queryResult = await pool.query('SELECT messages FROM dialogs WHERE id = $1', [queryId]);
    const messages = queryResult.rows[0].messages;
    messages.push(newMessage);
    const json = JSON.stringify(messages);
    await pool.query('UPDATE dialogs SET messages = $1 WHERE id = $2',
        [json, queryId]);
    res.json('Good')
}