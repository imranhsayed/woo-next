import Head from 'next/head';
import { AppProvider } from "./context/AppContext";
import Header from "./Header";
import Footer from "./Footer";
import '../styles/Style.css';
import client from "./ApolloClient";
import { ApolloProvider } from '@apollo/client';

const Layout = ( props ) => {
	return (
		<AppProvider>
			<ApolloProvider client={ client }>			
					<div>
						<Head>
							<title>Woocommerce React Theme</title>
							<link rel="stylesheet"
							      href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
							<link rel="stylesheet" href="https://bootswatch.com/4/flatly/bootstrap.min.css"/>
						</Head>
						<Header/>
							{ props.children }
						<Footer/>
					</div>				
			</ApolloProvider>
		</AppProvider>
	);
};

export default Layout;
