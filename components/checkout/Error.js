const Error = ( { errors, fieldName } ) => {

	return(
		errors && ( errors.hasOwnProperty( fieldName ) ) ? (
			<div className="invalid-feedback d-block">{ errors[fieldName] }</div>
		) : ''
	)
};

export default Error;
