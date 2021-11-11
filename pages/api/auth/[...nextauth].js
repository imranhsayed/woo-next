import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { print } from 'graphql';
import gql from 'graphql-tag';
import axios from 'axios'
import { JWT_SECRET } from '../../../src/utils/endpoints'

const LOGIN_USER = gql`mutation LoginUser($username: String!, $password: String!) {
  login( input: {
    username: $username,
    password: $password
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
              username: credentials?.email,
              password: credentials?.password
            }
          });

          const {authToken} = response?.data?.data?.login;

          if ( authToken ) {
            const {user} = response?.data?.data?.login
            const userData = {
              id: user?.id,
              name: user?.name,
              // email: user?.user_email
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
  },
  pages: {
    signIn: '/auth/signin'
  }
}

export default ( req, res ) => NextAuth( req, res, options )