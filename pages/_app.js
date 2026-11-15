import "nprogress/nprogress.css";
import "../src/styles/style.scss";
import "../src/styles/main.scss";

import Router from 'next/router';
import NProgress from 'nprogress';
import { Anton, Archivo, Pinyon_Script } from 'next/font/google';
import { ApolloProvider } from '@apollo/client';

import client from '../src/components/ApolloClient';
import { AppProvider } from '../src/components/context/AppContext';
import { UIProvider } from '../src/components/context/UIContext';

/**
 * WooNext typography.
 *
 * Anton for condensed uppercase headlines and prices, Archivo for body and UI,
 * Pinyon Script for the editorial accents. Loaded as CSS variables so
 * `tailwind.config.js` can map them onto `font-display`, `font-sans` and
 * `font-script`.
 */
const display = Anton( {
  subsets: [ 'latin' ],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
} );

const sans = Archivo( {
  subsets: [ 'latin' ],
  weight: [ '300', '400', '500', '600', '700', '800' ],
  variable: '--font-sans',
  display: 'swap',
} );

const script = Pinyon_Script( {
  subsets: [ 'latin' ],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
} );

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

/**
 * Application root.
 *
 * The data and shell-state providers sit here rather than in `Layout` so a
 * page can call `useCart` or `useUI` in its own body — the hooks would
 * otherwise run before the provider its own JSX renders.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={ client }>
      <AppProvider>
        <UIProvider>
          <div className={ `${ display.variable } ${ sans.variable } ${ script.variable } font-sans` }>
            <Component {...pageProps} />
          </div>
        </UIProvider>
      </AppProvider>
    </ApolloProvider>
  );
}

export default MyApp
