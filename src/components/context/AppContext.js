import React, { useState, useEffect } from 'react';
export const AppContext = React.createContext([
	{},
	() => {}
]);

export const AppProvider = ( props ) => {

	const [ cart, setCart ] = useState( null );

	useEffect( () => {

		// @TODO Will add option to show the cart with localStorage later.
		if ( typeof window !== 'undefined' ) {

			let cartData = localStorage.getItem( 'woo-next-cart' );
			cartData = null !== cartData ? JSON.parse( cartData ) : '';
			setCart( cartData );

		}

	}, [] );

	return (
		<AppContext.Provider value={ [ cart, setCart ] }>
			{ props.children }
		</AppContext.Provider>
	);
};
