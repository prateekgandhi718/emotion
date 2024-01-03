import NextAuth, { User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_AUTHORIZATION_URL =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
    scope: "openid https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.profile"
  });

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token:any) {
  try {
    const url =
      'https://oauth2.googleapis.com/token?' +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken
      })

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    })

    const refreshedTokenResponse = await response.json()

    if (!response.ok) {
      throw refreshedTokenResponse
    }

    return {
      ...token,
      accessToken: refreshedTokenResponse.access_token,
      accessTokenExpires: Date.now() + refreshedTokenResponse.expires_in * 1000,
      refreshToken: refreshedTokenResponse.refresh_token ?? token.refreshToken // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: GOOGLE_AUTHORIZATION_URL
    }),
  ],
  callbacks: {
    async jwt({ token, user, account} :{token: any, user: User, account:any}) {
      // Sign in initial
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_at * 1000,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          user
        }
      }

      // If the access token has not expired yet, return the previous token only.
      if (Date.now() < Number(token.accessTokenExpires)) {
        return token
      }

      // Access token has expired therefore try to update
      return refreshAccessToken(token)
    },
    async session({ session, token } : {session:any, token: any}) {
      session.user = token.user
      session.accessToken = token.accessToken //Gives access to access the google APIs (not a JWT)
      session.idToken = token.idToken //A JWT which has user details. Can decode this in backend and then store user details in the database.
      session.error = token.error
      return session
    }
  }
});

export { handler as GET, handler as POST };
