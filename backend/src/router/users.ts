import express from 'express'
import { getAllUsers } from '../controllers/users'

import { tokenRequired } from '../middlewares/index'

export default (router: express.Router) => {
    router.get('/fetchAllUsers', tokenRequired, getAllUsers)
}