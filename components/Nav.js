import Link from 'next/link';
import CartIcon from "./cart/CartIcon";
import { useState } from 'react';

const Nav = () => {

	const [ show, setDisplay ] = useState( false );

	return (
		<nav className="woo-next-menu-container navbar-dark bg-primary">
			{/*Branding*/}
			<div className="woo-next-branding">
				<Link href="/">
					<a className="">WooNext</a>
				</Link>
			</div>

			{/*Navigation menu*/}
			<div className={ `woo-next-sub-menu-wrap ${ show ? 'show' : '' }` } id="">
				<ul className="navbar-nav">
					<li className="nav-item">
						<Link href="/categories">
							<a className="nav-link">Categories</a>
						</Link>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">My Account</a>
					</li>
				</ul>
			</div>

		{/*	Cart and Menu button*/}
		<div className="woo-next-cart-and-menu-btn">
			{/*Cart Icon*/}
			<div>
				<CartIcon />
			</div>
			{/*Menu toggle button for mobile*/}
			<button
				onClick={ () => setDisplay( ! show ) }
				className="woo-next-menu-btn" type="button" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
		</div>
		</nav>
	)
};

export default Nav;
