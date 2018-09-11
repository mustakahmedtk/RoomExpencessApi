const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//create a schema 
const roomiesSchema = new mongoose.Schema({

    name: {
        type: String
    },
    email: {
        type: String
    },
    mobile_no: {
        type: Number
    }
})

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    mobile_no: {
        type: Number
    },
    roomies: [roomiesSchema]
})
//Schema methods
userSchema.pre('save', async function (next) {
    try {
        //generate hash password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(this.password, salt)
        this.password = passwordHash
        next();
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password)
    } catch (error) {
        throw new Error(error)
    }
}

//create a model
const User = mongoose.model('user', userSchema)

module.exports = User;


