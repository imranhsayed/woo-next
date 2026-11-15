import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from "@apollo/client";

import { GRAPHQL_URL } from "../constants/urls";

/**
 * Middleware operation
 * If we have a session token in localStorage, add it to the GraphQL request as a Session header.
 */
export const middleware = new ApolloLink( ( operation, forward ) => {
	/**
	 * If session data exist in local storage, set value as session header.
	 */
	const session = ( typeof window !== 'undefined' ) ?  localStorage.getItem( "woo-session" ) : null;

	if ( session ) {
		operation.setContext( ( { headers = {} } ) => ( {
			headers: {
				"woocommerce-session": `Session ${ session }`
			}
		} ) );
	}

	return forward( operation );

} );

/**
 * Afterware operation.
 *
 * This catches the incoming session token and stores it in localStorage, for future GraphQL requests.
 */
export const afterware = new ApolloLink( ( operation, forward ) => {

	return forward( operation ).map( response => {

		if ( typeof window === 'undefined' ) {
			return response;
		}

		/**
		 * Check for session header and update session in local storage accordingly.
		 */
		const context = operation.getContext();
		const { response: { headers } }  = context;
		const session = headers.get( "woocommerce-session" );

		if ( session ) {

			// Remove session data if session destroyed.
			if ( "false" === session ) {

				localStorage.removeItem( "woo-session" );

				// Update session new data if changed.
			} else if ( localStorage.getItem( "woo-session" ) !== session ) {

				localStorage.setItem( "woo-session", headers.get( "woocommerce-session" ) );

			}
		}

		return response;

	} );
} );

// Apollo GraphQL client.
const client = new ApolloClient({
	link: middleware.concat( afterware.concat( createHttpLink({
		uri: GRAPHQL_URL
	}) ) ),
	cache: new InMemoryCache(),
	/**
	 * Keep one-off queries out of the normalised cache.
	 *
	 * `getStaticProps` and `getServerSideProps` reach for this same module, so
	 * anything they cache during a build is still there when the page renders
	 * in that process — putting data into the prerendered HTML that the browser
	 * cannot reproduce on its first render, which breaks hydration. `query` is
	 * only used for that server-side fetching; components use `useQuery`, which
	 * reads `watchQuery` and keeps its cache.
	 */
	defaultOptions: {
		query: { fetchPolicy: 'no-cache' },
		watchQuery: { fetchPolicy: 'cache-first' },
	},
});

export default client;
