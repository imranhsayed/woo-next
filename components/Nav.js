import Link from 'next/link';
const Nav = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
			<div className="collapse navbar-collapse" id="navbarColor01">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item active">
						<Link href="/">
							<a className="nav-link">WooNext</a>
						</Link>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">Categories</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">My Account</a>
					</li>
				</ul>
			</div>
		</nav>
	)
};

export default Nav;
