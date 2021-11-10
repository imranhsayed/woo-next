import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { print } from 'graphql';
import gql from 'graphql-tag';
import axios from 'axios'

const LOGIN_USER = gql`mutation LoginUser {
  login( input: {
    username: "your_login",
    password: "your password"
  } ) {
    authToken
    user {
      id
      name
    }
  }
}
`

const options = {
  providers: [
    CredentialsProvider({
      name: "Drip",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "burduli94@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const response = await axios.post('https://staging.drip.ge/graphql', {
            query: print(LOGIN_USER),
            variables: {
              username: credentials.email,
              password: credentials.password
            }
          }, credentials);
          const {jwt} = response?.data?.data;
          const userObj = await axios.get(JWT_VALIDATE_TOKEN, {
            headers: {
              'Authorization': 'Bearer ' + jwt
            }
          });

          if ( userObj ) {
            const {user} = userObj?.data?.data
            const userData = {
              id: user?.ID,
              name: user?.user_nicename,
              email: user?.user_email
            }
            return userData
          }
        } catch(err) {
          console.log("errr", err);
          return null
        }
      }
    })
  ],
  session : {
    jwt: true
  },

  jwt: {
    secret: JWT_SECRET,
    verificationOptions: { algorithms: ['HS256']  },
  },

  callbacks: {
    async jwt({ token, user }) {
      if ( user ) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    }
  }
}

export default ( req, res ) => NextAuth( req, res, options )