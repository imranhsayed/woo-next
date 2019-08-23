const next = require( 'next' );
const express = require( 'express' );
const wooConfig = require( './wooConfig' );

const  WooCommerceAPI = require('woocommerce-api');

const WooCommerce = new WooCommerceAPI({
	url: wooConfig.siteUrl,
	consumerKey: wooConfig.consumerKey,
	consumerSecret: wooConfig.consumerSecret,
	wpAPI: true,
	version: 'wc/v1'
});

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
	.then( () => {
		const server = express();

		server.get( '/getProducts', ( req, response ) => {
			WooCommerce.get('products', function(err, data, res) {
				response.json( JSON.parse(res) );
			});
		} );


		/**
		 * If user lands directly on the product page,
		 * extract the product id from the url and handle
		 * the request.
		 */
		server.get( '/product/:slug', ( req, res ) => {

			const actualPage = '/product';
			const productId = parseInt( req.params.slug.split('-').pop() );
			const queryParams = { id: productId };

			app.render(req, res, actualPage, queryParams);
		});

		server.get( '*', ( req, res ) => {
			return handle( req, res );
		} );

		server.listen( port, err => {
			if ( err ) {
				throw err;
			}
			console.log( `Ready on ${port}` );
		} )

	} )
	.catch(ex => {
	console.error(ex.stack);
	process.exit(1);
});;
