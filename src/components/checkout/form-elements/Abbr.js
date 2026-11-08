import PropTypes from 'prop-types';

const Abbr = ({required = false}) => {
    if ( !required ) {
    	return null;
    }

    return <abbr className="text-red-500" style={{textDecoration: 'none'}} title="required">*</abbr>
}

Abbr.propTypes = {
    required: PropTypes.bool
}

export default Abbr
