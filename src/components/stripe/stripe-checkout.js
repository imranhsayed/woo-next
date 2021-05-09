import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {useEffect} from "react";
import PropTypes from 'prop-types';
import {useQuery} from "@apollo/client";

import StripeCheckoutForm from "./stripe-checkout-form";
import {GET_ORDER} from "../../queries/get-order";
import client from "../ApolloClient";

const StripeCheckout = ({showStripeForm, createdOrderData}) => {

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    useEffect(() => {
        if ( showStripeForm ) {
            document.body.classList.add( 'is-modal-open' )
        } else {
            document.body.classList.remove( 'is-modal-open' )
        }
    }, [showStripeForm])

    // Get Order Data.
    // const {data} = useQuery(GET_ORDER, {
    //     client,
    //     variables: {
    //         orderId: 2125
    //     },
    //     notifyOnNetworkStatusChange: true,
    //     onCompleted: () => {
    //         console.log( 'data', data );
    //     }
    // });

    if ( !showStripeForm ) {
    	return null;
    }

    return (
        <Elements stripe={stripePromise}>
            <StripeCheckoutForm orderData={createdOrderData} />
        </Elements>
    );
};

StripeCheckout.propTypes = {
    showStripeForm: PropTypes.bool,
    createdOrderData: PropTypes.object
}

StripeCheckout.defaultProps = {
    showStripeForm: false,
    createdOrderData: {
        orderId: '',
        total: '',
        currency: '',
    }
}

export default StripeCheckout;
