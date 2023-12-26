import express from 'express'
import { getUsers } from '../db/users';
import { CustomRequest } from 'middlewares';

export const getAllUsers = async (req: CustomRequest, res: express.Response) => {
    try {
        const users = await getUsers()
        return res.status(200).json({ data: users, message: "Fetched the users successfully." });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Bad Request' });
    }
}