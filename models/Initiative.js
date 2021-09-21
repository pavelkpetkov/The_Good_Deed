const { Schema, model } = require('mongoose');

const schema = new Schema({
    category: { type: String, required: true },
    title: { type: String, required: [true, 'Title is required'], minLength: [3, 'Title has to be at least 3 characters long'] },
    location: {type: String, required: true },
    img: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: [true, 'Description is required'], minLength: [10, 'Description has to be at least 10 characters long'] },
    joined: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    usersLiked: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    author: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = model('Initiative', schema);