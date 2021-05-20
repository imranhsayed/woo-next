import Layout from "../src/components/Layout";
import {useState, useEffect, useContext} from "react";
import {AppContext} from "../src/components/context/AppContext";
import Router from "next/router";

const ThankYouContent = () => {
    const [cart, setCart] = useContext(AppContext);
    const [isSessionFetching, setSessionFetching] = useState(false);
    const [sessionData, setSessionData] = useState(null);

    const getSessionData = async (sessionId) => {
        setSessionFetching(true);
        const request = await fetch('./api/get-stripe-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-cache',
            body: JSON.stringify({
                sessionId
            })
        });

        const session = await request.json();
        setSessionData(session);
        setSessionFetching(false);
    }


    useEffect(async () => {
        if ( process.browser ) {
            localStorage.removeItem( 'woo-next-cart' );
            setCart(null);

            await getSessionData( Router.query.session_id );
        }

    }, []);

    console.log( 'sessionData', sessionData );

    return (
        <div className="h-almost-screen">
            Hello
        </div>
    )
}

const ThankYou = () => {
    return (
        <Layout>
            <ThankYouContent/>
        </Layout>
    )
}

export default ThankYou;
