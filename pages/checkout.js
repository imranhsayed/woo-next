import Layout from "../components/Layout";
import CheckoutForm from "../components/checkout/CheckoutForm";

const Checkout = () => (
	<Layout>
		<div className="checkout container mx-auto my-32 px-4 xl:px-0">
			<h1 className="mb-5 text-2xl uppercase">Checkout Page</h1>
			<CheckoutForm/>
		</div>
	</Layout>
);

export default Checkout;
