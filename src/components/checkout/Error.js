const Error = ( { errors, fieldName } ) => {

	return(
		errors && ( errors.hasOwnProperty( fieldName ) ) ? (
			<div className="invalid-feedback d-block text-red-500">{ errors[fieldName] }</div>
		) : ''
	)
};

export default Error;
