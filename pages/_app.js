import { SessionProvider } from "next-auth/react"
import { ChakraProvider } from "@chakra-ui/react"
import "../src/styles/style.scss"
import "../src/styles/main.scss"

import Router from 'next/router'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <ChakraProvider>
        <Component {...pageProps}></Component>
      </ChakraProvider>
    </SessionProvider>
  )
}

export default MyApp

