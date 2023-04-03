const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
// const dotenv = require('dotenv') 
require('dotenv').config();
const { readdirSync } = require('fs')
const connectDB = require('./config/db')


const app = express()

// ConnectDB
connectDB()

//middleware
app.use(morgan('dev'))
app.use(bodyParser.json({limit:'20mb'}))
app.use(cors())

const cloudinary = require("./routes/cloudinary.js")
const order = require("./routes/order.js")
const users = require("./routes/users.js")
const category = require("./routes/category.js")
const auth = require("./routes/auth.js")
const admin = require("./routes/admin.js")
const product = require("./routes/product.js")
const autonumber = require("./routes/autonumber.js")

 app.get('/tam',(req,res)=>{
    res.send('hello tam')
 })

app.use('/api/users', users)
app.use('/api/cloudinary', cloudinary)
app.use('/api/product', product)
app.use('/api/order', order)
app.use('/api/category', category)
app.use('/api/auth', auth)
app.use('/api/admin', admin)
app.use('/api/autonumber', autonumber)

const port = 4000
app.listen(port,()=>{
    console.log('Server is running on port '+port)
})
