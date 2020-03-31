import Layout from "../components/Layout";
import CheckoutForm from "../components/checkout/CheckoutForm";

const Checkout = () => (
	<Layout>
		<div className="container mt-5">
			<h1 className="mt-5 mb-4">Checkout Page.</h1>
			<CheckoutForm/>
		</div>
	</Layout>
);

export default Checkout;
