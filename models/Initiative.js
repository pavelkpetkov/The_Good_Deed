const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: { type: String, required: [true, 'Title is required'], minLength: [3, 'Title has to be at least 3 characters long'] },
    description: { type: String, required: [true, 'Description is required'], minLength: [10, 'Description has to be at least 10 characters long'] },
    image: { type: String, required: true },
    joined: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    author: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = model('Initiative', schema);