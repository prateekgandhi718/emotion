import { createUser, getUserBySub } from '../db/users';
import express from 'express'
import { OAuth2Client } from 'google-auth-library';
import { Document } from 'mongoose';

// Implement the middleware. To protect the API routes so that no other person can directly access the Api routes. Verift the ID token with the string that is set up in the frontend with which are your tokens are supposedly signed with. Also, this will take the accesstoken from the request headers, append it in the request for easy access for all my apis.

export interface CustomRequest extends express.Request {
    user?: Document<any, any, { email: string; userSub: string }>;
    accessToken?: string
    // We can add any other custom properties we might include in your user object
    // Example: userRole?: string;
  }

export const tokenRequired = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
    try {
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        const accessToken = req.headers['x-access-token'] as string

        if (!idToken || !accessToken) {
            return res.status(401).json({ message: 'Unauthorized - missing tokens.'})
        }

        // Verify and decode the JWT Id token
        
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, sub } = payload || {};

        if (!email || !sub) {
            return res.status(401).json({ message: 'Unauthorized - Could not verify the ID and hence could not give the ticket to access resources.'})
        }

        let user = await getUserBySub(sub)

        // If user does not exist in the db, create a fresh one.
        if (!user) {
            user = await createUser({email, userSub: sub})
        }

        req.user = user.toObject()
        req.accessToken = accessToken

        // Proceed to the route (or some other middleware if any)
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Bad Request' });
    }
}