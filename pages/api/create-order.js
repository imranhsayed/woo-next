import WooCommerceRestApiPkg from "@woocommerce/woocommerce-rest-api";
import {isEmpty} from 'lodash'
import { WORDPRESS_URL } from "../../src/constants/urls";

// The package is CommonJS and exposes the class on `.default`, so unwrap it
// explicitly rather than relying on bundler interop.
const WooCommerceRestApi = WooCommerceRestApiPkg.default ?? WooCommerceRestApiPkg;

const api = new WooCommerceRestApi({
    url: WORDPRESS_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: "wc/v3"
});

/**
 * Create order endpoint.
 *
 * @see http://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#create-an-order
 *
 * @param {Object} req Request.
 * @param {Object} res Response.
 *
 * @return {Promise<{orderId: string, success: boolean, error: string}>}
 */
export default async function handler(req, res) {

    const responseData = {
        success: false,
        orderId: '',
        orderNumber: '',
        orderKey: '',
        total: '',
        currency: '',
        error: ''
    }

    if ( isEmpty(req.body) ) {
        responseData.error = 'Required data not sent';
        return res.status(400).json(responseData);
    }

    const data = req.body;
    data.status = 'pending';
    data.set_paid = false;

    try {
        const {data} = await api.post(
            'orders',
            req.body
        );

        responseData.success = true;
        /**
         * `id` identifies the order to the REST API, `number` is what the
         * customer sees, and `order_key` is the token the confirmation page
         * presents to prove it may read this order.
         */
        responseData.orderId = data.id;
        responseData.orderNumber = data.number;
        responseData.orderKey = data.order_key;
        responseData.total = data.total;
        responseData.currency = data.currency;

        res.json(responseData)

    } catch (error) {
        /**
         * Request usually fails if the data in req.body is not sent in the format required.
         *
         * @see Data shape expected: https://stackoverflow.com/questions/49349396/create-an-order-with-coupon-lines-in-woocomerce-rest-api
         */
        responseData.error = error.message;
        res.status(500).json(responseData);
    }
}
