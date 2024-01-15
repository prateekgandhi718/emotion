import express from 'express'
import users from './users'
import emails from './emails'

const router = express.Router()

export default (): express.Router => {
    users(router)
    emails(router)
    
    return router
}