import Link from 'next/link';
import { useState } from 'react';
import cx from 'classnames';

import Icon from '../ui/Icon';
import useReveal, { revealClass } from '../../hooks/useReveal';
import { FAQS } from '../../constants/home';

/**
 * Frequently-asked accordion.
 *
 * One panel open at a time, starting on the second question the way the
 * prototype does, so the section reads as interactive at a glance.
 *
 * @return {jsx}
 */
const FaqAccordion = () => {

	const [ ref, isRevealed ] = useReveal();
	const [ openIndex, setOpenIndex ] = useState( 1 );

	return (
		<section
			ref={ ref }
			aria-labelledby="faq-title"
			className={ cx(
				'mx-auto w-full max-w-4xl px-4 py-10 transition duration-500 motion-reduce:transition-none sm:px-6',
				revealClass( isRevealed )
			) }
		>
			<p className="text-center text-xs font-bold uppercase tracking-widest text-flame">Need a hand?</p>
			<h2 id="faq-title" className="text-center font-display text-5xl uppercase leading-none text-cream sm:text-6xl">Frequently asked</h2>

			<ul className="mt-8 flex flex-col gap-3">
				{ FAQS.map( ( faq, index ) => {

					const isOpen = openIndex === index;

					return (
						<li
							key={ faq.question }
							className={ cx(
								'overflow-hidden rounded-md bg-petrol ring-1 transition-colors duration-300',
								isOpen ? 'ring-ember/60' : 'ring-white/10'
							) }
						>
							<h3>
								<button
									type="button"
									id={ `faq-button-${ index }` }
									onClick={ () => setOpenIndex( isOpen ? -1 : index ) }
									aria-expanded={ isOpen }
									aria-controls={ `faq-panel-${ index }` }
									className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-xl font-medium text-cream transition-colors hover:text-flame focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-flame sm:text-2xl"
								>
									{ faq.question }
									<span className={ cx(
										'grid h-8 w-8 shrink-0 place-items-center rounded-full transition duration-300 motion-reduce:transition-none',
										isOpen ? 'rotate-180 bg-ember text-midnight' : 'text-cream ring-1 ring-peach/40'
									) }>
										<Icon name="chevron-down" className="h-4 w-4" />
									</span>
								</button>
							</h3>

							<div
								id={ `faq-panel-${ index }` }
								role="region"
								aria-labelledby={ `faq-button-${ index }` }
								className={ cx(
									'grid transition-all duration-300 ease-out motion-reduce:transition-none',
									isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
								) }
							>
								<p className="px-5 pb-5 text-base leading-relaxed text-peach/85">{ faq.answer }</p>
							</div>
						</li>
					);
				} ) }
			</ul>

			<p className="mt-6 text-center text-sm text-peach/80">
				More questions? <Link href="/page/faq" className="font-semibold text-flame underline underline-offset-4">Visit the full FAQ</Link> or{ ' ' }
				<Link href="/page/contact" className="font-semibold text-flame underline underline-offset-4">contact us</Link>.
			</p>
		</section>
	);
};

export default FaqAccordion;
