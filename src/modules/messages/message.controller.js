import Message from './../../../db/models/message/message.model.js';

export const sendMessage = async (req, res) => {
    const { message } = req.body;
    await Message.create({ content: message, user: req.params.id });
    return res.redirect(`/user/${req.params.id}`);
};
