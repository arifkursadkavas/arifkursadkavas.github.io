import React from "react";
import App from "next/app";
import type { AppProps } from "next/app";
import Sidebar from "../components/Sidebar";

import "../../styles/globals.scss";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Script from "next/script";

const HashgeshApp = ({ Component, pageProps }: AppProps) => {
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
