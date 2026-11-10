const path = require("path");

const wordPressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

if ( ! wordPressUrl ) {
    throw new Error(
        'NEXT_PUBLIC_WORDPRESS_URL is not set. Copy .env-example to .env.local and set it before running Next.js.'
    );
}

const { protocol, hostname } = new URL( wordPressUrl );

module.exports = {
    trailingSlash: true,
    /**
     * Expose the checkout autofill flag to the browser.
     *
     * Client code can only read env vars inlined at build time, which normally
     * requires a NEXT_PUBLIC_ prefix. Mapping it here keeps the variable named
     * AUTOFILL_CHECKOUT_FORM in .env.local.
     */
    env: {
        AUTOFILL_CHECKOUT_FORM: process.env.AUTOFILL_CHECKOUT_FORM,
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "src/styles")],
    },
    /**
     * We specify which remote hosts are allowed to be optimized.
     * This is needed to ensure that external urls can't be abused.
     * @see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
     */
    images: {
        remotePatterns: [
            {
                protocol: protocol.replace( ':', '' ),
                hostname,
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
        ],
    },
};
