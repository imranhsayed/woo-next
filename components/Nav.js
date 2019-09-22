import Link from 'next/link';
import CartIcon from "./cart/CartIcon";
import { useState } from 'react';

const Nav = () => {

	const [ show, setDisplay ] = useState( false );

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
			{/*Branding*/}
			<Link href="/">
				<a className="navbar-brand nav-link">WooNext</a>
			</Link>

			{/*Menu toggle button for mobile*/}
			<button
				onClick={ () => setDisplay( ! show ) }
				className="navbar-toggler woo-next-menu-btn" type="button" data-toggle="collapse" data-target="#navbarColor01"
			        aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			{/*Navigation menu*/}
			<div className={ `collapse navbar-collapse ${ show ? 'show' : '' }` } id="navbarColor01">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item">
						<a className="nav-link" href="#">Categories</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">My Account</a>
					</li>
				</ul>
			</div>
			{/*Cart Icon*/}
			<div>
				<CartIcon />
			</div>
		</nav>
	)
};

export default Nav;
