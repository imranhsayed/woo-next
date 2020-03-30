import fetch from 'node-fetch';
// import { ApolloClient } from 'apollo-client';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { createHttpLink } from 'apollo-link-http';
//
// import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
// import introspectionQueryResultData from '../fragmentTypes';
//
import clientConfig from './../client-config';
//
// // Fragment matcher.
// const fragmentMatcher = new IntrospectionFragmentMatcher({
// 	introspectionQueryResultData
// });
//
// // Apollo GraphQL client.
// const client = new ApolloClient({
// 	link: createHttpLink({
// 		uri: clientConfig.graphqlUrl,
// 		fetch: fetch
// 	}),
// 	cache: new InMemoryCache( { fragmentMatcher } ),
// });


// Node modules
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { get, isEmpty } from 'lodash';

// Local imports
import { typeDefs, resolvers } from './utils/schema';

// Apollo Caching configuration
const cache = new InMemoryCache({
	dataIdFromObject: (object) => {
		// eslint-disable-next-line
		switch (object.__typename) {
			case 'CartItem':
				return object.key;
			default:
				return object.id || defaultDataIdFromObject(object);
		}
	},
});

// Authorization middleware
const middleware = new ApolloLink((operation, forward) => {
	const token = localStorage.getItem('user-token');
	const session = localStorage.getItem('woo-session');
	const middlewareHeaders = {};
	middlewareHeaders.authorization = token ? `Bearer ${token}` : '';
	if (session) {
		middlewareHeaders['woocommerce-session'] = session;
	}
	if (!isEmpty(middlewareHeaders)) {
		operation.setContext(({ headers = {} }) => ({
			headers: {
				...headers,
				...middlewareHeaders,
			},
		}));
	}

	return forward(operation);
});

// Authorization afterware
const afterware = new ApolloLink((operation, forward) => forward(operation)
	.map((response) => {
		// Update session data.
		const context = operation.getContext();
		const { response: { headers } } = context;
		const session = headers.get('woocommerce-session');

		if (session) {
			if (session === 'false') {
				localStorage.removeItem('woo-session');
			} else if (localStorage.getItem('woo-session') !== session) {
				localStorage.setItem('woo-session', headers.get('woocommerce-session'));
			}
		}

		// Update token if changed.
		const authToken = get(response, 'data.login.authToken');
		if (authToken && authToken !== localStorage.getItem('user-token')) {
			localStorage.setItem('user-token', authToken);
		}

		return response;
	}));

const onForbidden = onError(({ networkError }) => {
	if (networkError && networkError.statusCode === 403) {
		localStorage.clear();
	}
});

const httpLink = new HttpLink({ uri: clientConfig.graphqlUrl });
const client = new ApolloClient({
	link: onForbidden.concat(middleware.concat(afterware.concat(httpLink))),
	cache,
	clientState: {},
	typeDefs,
	resolvers,
});

export default client;
