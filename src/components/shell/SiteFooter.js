import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import cx from 'classnames';

import Icon from '../ui/Icon';
import { useUI } from '../context/UIContext';
import {
	FOOTER_COLUMNS,
	FOOTER_LEGAL_LINKS,
	FOOTER_PILLS,
	PAYMENT_METHODS,
	SOCIAL_LINKS,
} from '../../constants/nav';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter sign-up.
 *
 * Validates locally and confirms in place. There is no list provider wired up
 * yet, so nothing leaves the browser — the copy says so.
 *
 * @return {jsx}
 */
const NewsletterForm = () => {

	const { toast } = useUI();

	const [ email, setEmail ] = useState( '' );
	const [ error, setError ] = useState( '' );
	const [ isBusy, setBusy ] = useState( false );
	const [ isDone, setDone ] = useState( false );

	const onSubmit = ( event ) => {

		event.preventDefault();

		const value = email.trim();

		if ( ! value ) {
			setError( 'Please enter your email address.' );
			return;
		}

		if ( ! EMAIL_PATTERN.test( value ) ) {
			setError( 'That email doesn’t look right — check for typos.' );
			return;
		}

		setBusy( true );

		setTimeout( () => {
			setBusy( false );
			setDone( true );
			toast( 'Subscribed — watch your inbox for the next drop' );
		}, 700 );
	};

	if ( isDone ) {
		return (
			<p role="status" className="flex items-center gap-3 rounded-full bg-midnight px-6 py-3 text-sm font-bold uppercase tracking-widest text-cream">
				<Icon name="check" className="h-5 w-5 text-flame" />
				You’re on the list — welcome to WooNext ({ email.trim() })
			</p>
		);
	}

	return (
		<form onSubmit={ onSubmit } noValidate className="flex w-full max-w-lg flex-col gap-2">
			<div className="flex w-full overflow-hidden rounded-md bg-cream ring-2 ring-transparent transition focus-within:ring-midnight">
				<label htmlFor="newsletter-email" className="sr-only">Email address</label>
				<input
					id="newsletter-email"
					type="email"
					autoComplete="email"
					value={ email }
					onChange={ ( event ) => {
						setEmail( event.target.value );
						setError( '' );
					} }
					placeholder="Enter your email"
					aria-invalid={ error ? 'true' : 'false' }
					aria-describedby="newsletter-message"
					className="min-h-12 flex-1 border-0 bg-transparent px-4 text-sm font-semibold uppercase tracking-wider text-midnight placeholder-midnight/50 focus:outline-none focus:ring-0"
				/>
				<button
					type="submit"
					disabled={ isBusy }
					className="group inline-flex items-center gap-2 bg-midnight px-5 text-sm font-bold uppercase tracking-widest text-cream transition-colors hover:bg-navy focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-flame disabled:opacity-70"
				>
					{ isBusy ? 'Sending…' : 'Subscribe' }
					<span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
						<Icon name="arrow-right" className="h-4 w-4" />
					</span>
				</button>
			</div>
			<p id="newsletter-message" className="min-h-5 text-left text-sm font-semibold text-midnight" aria-live="polite">{ error }</p>
		</form>
	);
};

/**
 * Storefront footer.
 *
 * Newsletter band, the oversized WOONEXT wordmark with its floating pill nav,
 * four link columns beside the brand blurb and socials, then the payment and
 * legal strip.
 *
 * @return {jsx}
 */
const SiteFooter = () => {

	const router = useRouter();

	return (
		<footer className="relative overflow-hidden bg-midnight">
			<section aria-labelledby="newsletter-title" className="relative overflow-hidden bg-gradient-to-br from-rust via-ember to-rust">
				<div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-16 text-center sm:py-20">
					<h2 id="newsletter-title" className="font-display text-4xl uppercase leading-none tracking-wide text-cream sm:text-6xl lg:text-7xl">
						Subscribe to our newsletter to get updates on our latest collections
					</h2>
					<NewsletterForm />
					<p className="text-xs text-midnight/80">Demo sign-up: your email stays in this browser. Unsubscribe anytime.</p>
				</div>
			</section>

			<div className="relative bg-gradient-to-b from-midnight to-navy pt-12 sm:pt-16 lg:pt-20">
				<p aria-hidden="true" className="select-none text-center font-display text-mega uppercase text-peach">Woonext</p>
				<nav aria-label="Footer quick links" className="absolute inset-x-0 top-1/2 flex justify-center px-4">
					<ul className="flex justify-center gap-0.5 rounded-full bg-rust p-1 shadow-2xl shadow-black/40 sm:gap-1 sm:p-1.5">
						{ FOOTER_PILLS.map( ( pill ) => {

							const isCurrent = router.asPath === pill.href;

							return (
								<li key={ pill.href }>
									<Link
										href={ pill.href }
										aria-current={ isCurrent ? 'page' : undefined }
										className={ cx(
											'block rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-200 sm:px-6 sm:tracking-widest',
											isCurrent ? 'bg-cream text-midnight' : 'text-cream hover:bg-cream/20'
										) }
									>
										{ pill.label }
									</Link>
								</li>
							);
						} ) }
					</ul>
				</nav>
			</div>

			<div className="bg-navy">
				<div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-12 lg:px-8">
					<div className="flex flex-col gap-4 lg:col-span-4">
						<p className="font-display text-4xl uppercase tracking-wide text-rust">Woo<span className="text-peach">next</span></p>
						<p className="max-w-xs text-sm leading-relaxed text-peach/80">
							Timeless retro pieces with a modern twist — tailored for the bold, the bright and the everyday.
						</p>
						<ul className="flex gap-2" aria-label="Social media">
							{ SOCIAL_LINKS.map( ( social ) => (
								<li key={ social.label }>
									<Link
										href={ social.href }
										aria-label={ `WooNext on ${ social.label }` }
										className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-peach/30 transition duration-200 hover:bg-ember hover:text-midnight hover:ring-ember"
									>
										<Icon name={ social.icon } />
									</Link>
								</li>
							) ) }
						</ul>
					</div>

					{ FOOTER_COLUMNS.map( ( column ) => (
						<div key={ column.title } className="lg:col-span-2">
							<h3 className="font-display text-xl uppercase tracking-wide text-cream">{ column.title }</h3>
							<ul className="mt-4 flex flex-col gap-2.5 text-sm">
								{ column.links.map( ( link ) => (
									<li key={ link.href + link.label }>
										<Link href={ link.href } className="text-peach/80 transition-colors hover:text-flame">{ link.label }</Link>
									</li>
								) ) }
							</ul>
						</div>
					) ) }
				</div>

				<div className="border-t border-white/10">
					<div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-peach/70 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
						<ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
							{ PAYMENT_METHODS.map( ( method ) => (
								<li key={ method } className="rounded bg-cream px-2.5 py-1 text-xs font-extrabold tracking-wide text-midnight">{ method }</li>
							) ) }
						</ul>
						<ul className="flex flex-wrap gap-x-5 gap-y-2">
							{ FOOTER_LEGAL_LINKS.map( ( link ) => (
								<li key={ link.href }>
									<Link href={ link.href } className="hover:text-flame">{ link.label }</Link>
								</li>
							) ) }
						</ul>
						<p>© { new Date().getFullYear() } WooNext. Built with Next.js and WooCommerce.</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default SiteFooter;
