import Layout from "../components/Layout";
import VariableCartOptions from "../components/utils/variable-cart-options";
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import client from "../components/ApolloClient";

const Testing = () => {
	return (

		<ApolloProvider client={client}>
			<ApolloHooksProvider client={client}>
		<Layout>
			<VariableCartOptions productId={ 29 } id={ 'myId' }/>
		</Layout>
			</ApolloHooksProvider>
		</ApolloProvider>
	)
};

export default Testing;
