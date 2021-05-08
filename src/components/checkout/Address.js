import React from 'react';
import Error from "./Error";
import PropTypes from 'prop-types';
import CountrySelection from "./CountrySelection";
import StateSelection from "./StatesSelection";

const Address = ({ input, countries, states, handleOnChange } ) => {

	const {wooStates} = states || {};
	const statesData = wooStates?.states ? JSON.parse( wooStates?.states ) : {}
	console.log( 'statesData', statesData );

	return (
		<React.Fragment>
			{/*Name*/}
			<div className="">
				<div className="">
					<div className="form-group mb-3">
						<label className="leading-7 text-sm text-gray-600" htmlFor="first-name">
							First Name
							<abbr className="required" title="required">*</abbr>
						</label>
						<input onChange={ handleOnChange } value={ input.firstName } type="text" name="firstName" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-400 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" id="first-name"/>
						<Error errors={ input.errors } fieldName={ 'firstName' }/>
					</div>
				</div>
				<div className="">
					<div className="form-group mb-3">
						<label className="leading-7 text-sm text-gray-600" htmlFor="last-name">
							Last Name
							<abbr className="required" title="required">*</abbr>
						</label>
						<input onChange={ handleOnChange } value={ input.lastName } type="text" name="lastName" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-400 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" id="last-name"/>
						<Error errors={ input.errors } fieldName={ 'lastName' }/>
					</div>
				</div>
			</div>
			{/* Company Name */}
			<div className="form-group mb-3">
				<label className="leading-7 text-sm text-gray-600" htmlFor="first-name">Company Name</label>
				<input onChange={ handleOnChange } value={ input.company } type="text" name="company" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-400 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" id="first-name"/>
				<Error errors={ input.errors } fieldName={ 'company' }/>
			</div>
			{/* Country */}
			<CountrySelection input={input} handleOnChange={handleOnChange} countries={countries}/>
			{/* Street Address */}
			<div className="form-group mb-3">
				<label className="leading-7 text-sm text-gray-600" htmlFor="street-address">
					Street Address
					<abbr className="required" title="required">*</abbr>
				</label>
				<input type="text" onChange={ handleOnChange } value={ input.address1 } name="address1" placeholder="House number and street name" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-400 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" id="street-address"/>
				<Error errors={ input.errors } fieldName={ 'address1' }/>
				<br/>
				<br/>
				<input type="text" onChange={ handleOnChange } value={ input.address2 } name="address2" placeholder="Apartment, suite, unit etc.(optional)" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-400 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" id="first-name"/>
			</div>
			{/* Town/City */}
			<div className="form-group mb-3">
				<label className="leading-7 text-sm text-gray-600" htmlFor="city">
					Town/City
					<abbr className="required" title="required">*</abbr>
				</label>
				<input onChange={ handleOnChange } value={ input.city } type="text" name="city" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-400 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" id="city"/>
				<Error errors={ input.errors } fieldName={ 'city' }/>
			</div>
			{/* State */}
			<StateSelection input={input} handleOnChange={handleOnChange} states={statesData}/>
			{/* Post Code */}
			<div className="form-group mb-3">
				<label className="leading-7 text-sm text-gray-600" htmlFor="post-code">
					Postcode
					<abbr className="required" title="required">*</abbr>
				</label>
				<input onChange={ handleOnChange } value={ input.postcode } type="text" name="postcode" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-400 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" id="post-code"/>
				<Error errors={ input.errors } fieldName={ 'postcode' }/>
			</div>
			{/*Phone & Email*/}
			<div className="row">
				<div className="col-lg-6 col-md-12 p-0 pr-2">
					<div className="form-group mb-3">
						<label className="leading-7 text-sm text-gray-600" htmlFor="phone">
							Phone
							<abbr className="required" title="required">*</abbr>
						</label>
						<input onChange={ handleOnChange } value={ input.phone } type="text" name="phone" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-400 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" id="phone"/>
						<Error errors={ input.errors } fieldName={ 'phone' }/>
					</div>
				</div>
				<div className="col-lg-6 col-sm-12 p-0">
					<div className="form-group mb-3">
						<label className="leading-7 text-sm text-gray-600" htmlFor="email">
							Email
							<abbr className="required" title="required">*</abbr>
						</label>
						<input onChange={ handleOnChange } value={ input.email } type="email" name="email" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-400 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" id="email"/>
						<Error errors={ input.errors } fieldName={ 'email' }/>
					</div>
				</div>
			</div>
			{/*	@TODO Create an Account */}
			{/*<div className="form-check">*/}
			{/*	<label className="leading-7 text-sm text-gray-600" className="form-check-label">*/}
			{/*		<input onChange={ handleOnChange } className="form-check-input" name="createAccount" type="checkbox"/>*/}
			{/*			Create an account?*/}
			{/*	</label>*/}
			{/*</div>*/}
			{/*<h2 className="mt-4 mb-4">Additional Information</h2>*/}
			{/* @TODO Order Notes */}
			{/*<div className="form-group mb-3">*/}
			{/*	<label className="leading-7 text-sm text-gray-600" htmlFor="order-notes">Order Notes</label>*/}
			{/*	<textarea onChange={ handleOnChange } defaultValue={ input.orderNotes } name="orderNotes" className="form-control woo-next-checkout-textarea" id="order-notes" rows="4"/>*/}
			{/*	<Error errors={ input.errors } fieldName={ 'orderNotes' }/>*/}
			{/*</div>*/}
		</React.Fragment>
	);
};

Address.propTypes = {
	input: PropTypes.object,
	countries: PropTypes.array,
	handleOnChange: PropTypes.func
}

Address.defaultProps = {
	input: {},
	countries: [],
	handleOnChange: () => {}
}

export default Address;
