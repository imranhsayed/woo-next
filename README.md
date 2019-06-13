# Woo Next React Theme :rocket:
> * This is a React WooCommerce theme, built with Next JS, Webpack, Babel, Node, Express, using WooCommerce REST API.

## Demo :video_camera:

![](demo-example.gif)

# Features:

1. WooCommerce Store in React
2. SSR
3. SEO friendly
4. Automatic Code Splitting
5. Hot Reloading
6. Prefetching
7. Custom Server with Express

## Getting Started :rocket:

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Prerequisites :page_facing_up:


### Installing :wrench:

1. Clone this repo in `git clone git@github.com:imranhsayed/woo-next`
2. `cd woo-next`
3. `npm install`

## Configuration :wrench:

* Rename `client-config-example.js` to `client-config.js` and update your React Site URL

```ruby
const clientConfig = {
	siteUrl: 'http://xyz.com'
};

export default clientConfig;
```


* Rename `wooConfig.example.js` to `wooConfig.js` and update your WordPress Site URL and WooCommerce config keys

```ruby
const wooConfig = {
	siteUrl: 'https://xyz.com',
	consumerKey: 'xxxx',
	consumerSecret: 'xxx'
};

module.exports = wooConfig;

```

## Common Commands :computer:

* `dev` Runs server in development mode

## Contributing :busts_in_silhouette:

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning :bookmark_tabs:

I use [Git](https://github.com/) for versioning. 

## Author :bust_in_silhouette:

* **[Imran Sayed](https://codeytek.com)**

## License :page_with_curl:

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
