import {isEmpty} from "lodash";

import {decodeHtmlEntities, parsePriceNumber} from "../../../functions";

const Price = ({ regularPrice = 0, salesPrice }) => {

    if ( isEmpty( salesPrice ) ) {
    	return null;
    }

    /**
     * Get discount percent.
     *
     * @param {String} regularPrice
     * @param {String} salesPrice
     */
    const discountPercent = ( regularPrice, salesPrice ) => {
        if( isEmpty( regularPrice ) || isEmpty(salesPrice) ) {
            return null;
        }

        /**
         * Parse rather than slice off a leading currency symbol: the symbol may
         * trail the amount, and the decimal mark may be a comma.
         */
        const formattedRegularPrice = parsePriceNumber( regularPrice );
        const formattedSalesPrice = parsePriceNumber( salesPrice );

        if ( Number.isNaN( formattedRegularPrice ) || Number.isNaN( formattedSalesPrice ) || 0 === formattedRegularPrice ) {
            return null;
        }

        const discountPercent = ( ( formattedRegularPrice - formattedSalesPrice ) / formattedRegularPrice ) * 100;

        return {
            discountPercent: formattedSalesPrice !== formattedRegularPrice ? `(${discountPercent.toFixed(2)}%) OFF` : null,
            strikeThroughClass: formattedSalesPrice < formattedRegularPrice ? 'product-regular-price mr-2 line-through text-sm text-gray-600 font-normal' : ''
        }
    }

    const productMeta = discountPercent( regularPrice, salesPrice );

    // WooCommerce returns prices as HTML, so decode entities before rendering.
    const displayRegularPrice = decodeHtmlEntities( regularPrice );
    const displaySalesPrice = decodeHtmlEntities( salesPrice );

    return (
        <h6 className="product-price text-gray-800 font-semibold mr-3 mb-5">
            {/* Regular price */}
            { productMeta?.discountPercent ? <span className="product-price mr-2">{displaySalesPrice}</span> : null }

            {/* Discounted price */}
            <span className={productMeta?.strikeThroughClass}>{ displayRegularPrice }</span>

            {/* Discount percent */}
            <span className="product-discount text-green-600 font-bold text-sm font-normal">{productMeta?.discountPercent}</span>
        </h6>
    )
}

export default Price
