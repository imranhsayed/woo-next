# Woo Next React Theme :rocket:
> * This is a React WooCommerce theme, built with Next JS, Webpack, Babel, Node, GraphQl

[Full Course Video Tutorial](https://codeytek.com/course/woocommerce-with-react-course/)

## Demo Desktop :video_camera:

![](desktop-example.gif)

## Demo Tablet and Mobile View :video_camera:

![](tablet-mobile.gif)

## Categories
![](Categories.png)

## Live Demo:

[Live Demo Site](https://woo-next.imranhsayed.now.sh/)

## Checkout Page Demo
![](Checkout-page.gif)

## Payment Demo ( Paypal example )
![](paypal-payment-demo.gif)

## Order Received Demo
![](order-received-demo.gif)

# Features:

1. WooCommerce Store in React( contains: Products Page, Single Product Page, AddToCart, CartPage and Checkout Page )
2. SSR
3. SEO friendly
4. Automatic Code Splitting
5. Hot Reloading
6. Prefetching
7. GraphQL with Apollo Client

## Getting Started :rocket:

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Prerequisites :page_facing_up:


### Installing :wrench:

1. Clone this repo using terminal `git clone git@github.com:imranhsayed/woo-next`
2. `cd woo-next`
3. `npm install`

## Add GraphQl support for WordPress

1. Download and activate the following plugins , in your WordPress plugin directory:

* [wp-graphql](https://github.com/imranhsayed/woo-next/tree/master/wordpress/plugins) Exposes graphql for WordPress ( **Tested with v-0.8.0** of this plugin )
* [wp-graphiql](https://github.com/imranhsayed/woo-next/tree/master/wordpress/plugins) Provides GraphiQL IDE (playground) to the WP-Admin.
* [wp-graphql-woocommerce](https://github.com/imranhsayed/woo-next/tree/master/wordpress/plugins) Adds Woocommerce functionality to a WPGraphQL schema ( **Tested with v-0.5.0** of this plugin )

* Make sure Woocommerce plugin is also installed in your WordPress site. You can also import default wooCommerce products that come with wooCommerce Plugin for development ( if you don't have any products in your WordPress install ) `WP Dashboard > Tools > Import > WooCommerce products(CSV)`: The WooCommerce default products csv file is available at `wp-content/plugins/woocommerce/sample-data/sample_products.csv`



## Configuration :wrench:

* 1.Rename `client-config-example.js` to `client-config.js` and update your React Site URL, WordPressSite URL ( Used access it in ES6 file. ), productImagePlaceholder, singleImagePlaceholder

```javascript
const clientConfig = {
	siteUrl: 'xxxxx', // e.g. 'https://xyz.com'
    graphqlUrl: 'xxxxx' // e.g. 'https://wordpressSiteUrl.com/graphql',
    productImagePlaceholder: 'https://via.placeholder.com/800', // e.g https://via.placeholder.com/434 - Placeholder image URL for index page
    singleImagePlaceholder: 'https://via.placeholder.com/200', // e.g https://via.placeholder.com/200 - Placeholder image URL for individual product page
};

export default clientConfig;
```

* 2. Rename `wooConfig.example.js` to `wooConfig.example.js` and update your React Site URL and WordPressSite URL ( Used access it in common js file. )

```javascript
const wooConfig = {
	siteUrl: 'xxxxx', // e.g. 'https://xyz.com'
    graphqlUrl: 'xxxxx' // e.g. 'https://wordpressSiteUrl.com/graphql'
};

module.exports = wooConfig;
```

## Branch details

1. [feature/rest-api](https://github.com/imranhsayed/woo-next/tree/feature/rest-api) Contains REST API Implementation.

The master branch has the GraphQL implementation.  

## Common Commands :computer:

* `dev` Runs server in development mode

## Contributing :busts_in_silhouette:

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning :bookmark_tabs:

I use [Git](https://github.com/) for versioning. 

## Author :bust_in_silhouette:

* **[Imran Sayed](https://twitter.com/imranhsayed)**

## License :page_with_curl:

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
