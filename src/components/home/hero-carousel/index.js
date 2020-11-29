import { isEmpty, isArray } from 'lodash';
import Link from "next/link";
import {useState, useEffect, useRef} from 'react';

const HeroCarousel = ({heroCarousel}) => {

    if ( isEmpty(heroCarousel) || ! isArray( heroCarousel ) ) {
    	return null;
    }

    const autoPlay = true;
    const slideDuration = 2; // in seconds
    const activeIndexRef = useRef( { activeIndex: 0 } );
    const slideRef = useRef( 0 );
    const [ slide, setSlide ] = useState( 0 );
    const [ restartSlide, setRestartSlide ] = useState( 0 );
    const { activeIndex } = activeIndexRef.current;

    /**
     * Change to next slide.
     */
    const nextSlide = () => {

        if ( 1 === heroCarousel.length ) {
            return null;
        }

        /**
         * If if autoplay is set to true
         * and all slides are finished playing,
         * set the activeIndex to one and restart the slide from start.
         */
        if ( activeIndexRef.current.activeIndex === heroCarousel.length - 1 ) {

            activeIndexRef.current.activeIndex = 0;
            setRestartSlide( restartSlide + 1 );

        } else {

            // If its not the last slide increment active index by one.
            activeIndexRef.current.activeIndex =
                activeIndexRef.current.activeIndex + 1;

        }

        slideRef.current = slideRef.current + 1;
        setSlide( slideRef.current );

    };

    useEffect(() => {
        if ( autoPlay ) {
            const interval = setInterval(() => nextSlide(), slideDuration * 1000 );
            return () => clearInterval( interval );
        }
    }, [])

    return (
        <div className="banner flex flex-col sm:flex-row justify-between overflow-hidden">
            <div className="banner-img sm:w-8/12">
                {
                    heroCarousel.map( ( item, index ) => {
                        const opacity = ( activeIndex === index || 1 === heroCarousel.length ) ? 'opacity-100' : 'opacity-0';
                        return (
                            <div key={item?.id}className={`${opacity} banner-img-container absolute top-0 left-0`}>
                                <img
                                    src={item?.image?.sourceUrl} srcSet={item?.image?.srcSet} loading="lazy"
                                />
                            </div>
                        )
                    })
                }
                <div className="slider-button">
                    <button className="focus:outline-none" onClick={nextSlide}>
                        <svg width="25px" className="inline-block mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                    </button>
                    <button className="focus:outline-none" onClick={nextSlide}>
                        <svg width="25px" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                </div>
            </div>
            <div className="banner-content pt-10 sm:pt-0 px-10 sm:w-4/12">
                <h2 className="banner-content__title text-base md:text-4xl uppercase">{heroCarousel[activeIndex]?.name}</h2>
                <p className="banner-content__description text-base md:text-2xl text-gray-700">{heroCarousel[activeIndex]?.description}</p>
                <Link href={`/category/${heroCarousel[activeIndex]?.slug}/`}>
                    <a className="banner-content__link text-gray-700">+ Explore</a>
                </Link>
            </div>
        </div>
    )
}

export default HeroCarousel
