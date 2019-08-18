import fetch from 'node-fetch';
import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import config from './../client-config';
console.warn( 'mine', config.graphqlUrl );

// Apollo GraphQL client.
const client = new ApolloClient({
	link: createHttpLink({
		uri: config.graphqlUrl,
		fetch: fetch
	}),
	cache: new InMemoryCache(),
});

export default client;
