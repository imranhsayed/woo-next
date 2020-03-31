import Error from "./Error";

const PaymentModes = ( { input, handleOnChange } ) => {
	return (
		<div className="mt-3">
			<Error errors={ input.errors } fieldName={ 'paymentMode' }/>
			{/*Pay with Paypal*/}
			<div className="form-check woo-next-payment-input-container mt-2">
				<label className="form-check-label">
					<input onChange={ handleOnChange } value="paypal" className="form-check-input" name="paymentMode" type="radio"/>
					<span className="woo-next-payment-content">Pay with Paypal</span>
				</label>
			</div>
			{/*Pay with Stripe*/}
			<div className="form-check woo-next-payment-input-container">
				<label className="form-check-label">
					<input onChange={ handleOnChange } value="stripe" className="form-check-input" name="paymentMode" type="radio"/>
					<span className="woo-next-payment-content">Pay with Stripe</span>
				</label>
			</div>
			{/*	Payment Instructions*/}
			<div className="woo-next-checkout-payment-instructions">
				Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.
			</div>
		</div>
	);
};

export default PaymentModes;
