import React, { useEffect } from "react";
import App from "next/app";
import ReactGA from "react-ga";
import Sidebar from "../components/Sidebar";
import { Router } from "next/dist/client/router";

import "../../styles/globals.scss";
import { AppProps } from "next/dist/shared/lib/router/router";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Script from "next/script";

const HashgeshApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    Router.events.on("routeChangeStart", (route: string) => {
      ReactGA.set({ page: route }); // Update the user's current page
      ReactGA.pageview(route); // Record a pageview for the given page
      console.log(route);
      return true;
    });
  });

  return (
    <>
     <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-PBHF1JX21H"
      />

      <Script strategy="lazyOnload">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-PBHF1JX21H');
         `}
      </Script>
      <Header></Header>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default HashgeshApp;
