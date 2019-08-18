import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import config from './../client-config';

// Apollo GraphQL client.
const client = new ApolloClient({
	link: createHttpLink({
		uri: config.graphqlUrl,
	}),
	cache: new InMemoryCache(),
});

export default client;
