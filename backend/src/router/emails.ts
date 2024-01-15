import express from 'express'
import { fetchAndSaveMessageIdsAndContents } from '../controllers/emails'
import { tokenRequired } from '../middlewares/index'

export default (router: express.Router) => {
    router.get('/saveMessageIdsAndContents', tokenRequired, fetchAndSaveMessageIdsAndContents)
}