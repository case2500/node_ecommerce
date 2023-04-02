const mongoose = require('mongoose')

const connectDB = async() =>{
    try{
        await mongoose.connect('mongodb+srv://case2500:case2500@cluster0.v0srlyp.mongodb.net/?retryWrites=true&w=majority')
        console.log('Connect DB Success')
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB;