import express from 'express'
import http from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import router from './router'

require('dotenv').config();

const app = express()

app.use(cors())

const server = http.createServer(app)

server.listen(8080, () => {
    console.log('Server running on 8080')
})

mongoose.Promise = Promise
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on('error', (error: Error) => console.log(error))

app.use('/api', router())