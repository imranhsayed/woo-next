const withCSS = require('@zeit/next-css');
module.exports = withCSS({
  env: {
    'WP_URL': process.env.WP_URL,
    'PRODUCT_IMAGE_PLACEHOLDER': process.env.PRODUCT_IMAGE_PLACEHOLDER,
    'SINGLE_IMAGE_PLACEHOLDER': process.env.SINGLE_IMAGE_PLACEHOLDER
  }
});
