const User = require('../models/User');

async function createUser(name, email, hashedPassword) {
    //TODO Adapt properties to project requirements
    const user = new User({
        name,
        email,
        hashedPassword
    })
    await user.save();
    return user;
}

async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i');
    const user = await User.findOne({ email: { $regex: pattern } }).lean();
    return user;
}

//TODO add functions for finding users by other properties, as specified in the project requirements

module.exports = {
    createUser,
    getUserByEmail
}