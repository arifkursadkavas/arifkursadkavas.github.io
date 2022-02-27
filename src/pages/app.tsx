import React from 'react';
import App from 'next/app';
import "../../styles/index.scss";

import ReactGA from 'react-ga';

import { Router } from 'next/dist/client/router';
import Layout from '../components/Layout';
import Header from '../components/Header';



class HashgeshApp extends App {

    constructor(props) {
        super(props)
    }

    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return { pageProps };
    }

    componentDidMount(){
        ReactGA.initialize('UA-108070842-2');

        ReactGA.set({ page: 'index.html' }); // Update the user's current page
        ReactGA.pageview('index.html'); // Record a pageview for the given page
     
        Router.events.on('routeChangeStart', (route:string)=>{
            ReactGA.set({ page: route }); // Update the user's current page
            ReactGA.pageview(route); // Record a pageview for the given page
            console.log(route)
            return true
        })
    }

    render() {
        const { Component, pageProps } = this.props;
        //console.log(this.props);
        return (
            <>
                <Header name='Header' />
                <Layout>
                    {/* <Sidebar></Sidebar> */}

                        <Component {...pageProps} />

                    {/* <Footer name='Footer' /> */}
                </Layout>
            </>
        );
    }
}

export default HashgeshApp