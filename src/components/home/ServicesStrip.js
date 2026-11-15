import Icon from '../ui/Icon';
import { SERVICES } from '../../constants/home';

/**
 * Shipping, payment, returns and gifting reassurance strip.
 *
 * @return {jsx}
 */
const ServicesStrip = () => (
	<section aria-label="Store services" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<ul className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-white/10 lg:grid-cols-4">
			{ SERVICES.map( ( service ) => (
				<li key={ service.title } className="flex items-center gap-3 bg-petrol p-4 sm:p-5">
					<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ember text-midnight">
						<Icon name={ service.icon } />
					</span>
					<span>
						<span className="block text-sm font-bold text-cream">{ service.title }</span>
						<span className="block text-xs text-peach/75">{ service.text }</span>
					</span>
				</li>
			) ) }
		</ul>
	</section>
);

export default ServicesStrip;
