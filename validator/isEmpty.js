/**
 * Returns true if the value is undefined/null/empty object/empty string.
 *
 * @param value
 * @return {boolean}
 */
const isEmpty = ( value ) =>
	value === undefined ||
	value === null ||
	( typeof value === 'object' && Object.keys( value ).length === 0 ) ||
	( typeof value === 'string' && value.trim().length === 0 );

export default isEmpty;
