import React, { useEffect } from "react";
import App from "next/app";
import ReactGA from "react-ga";
import Sidebar from "../components/Sidebar";
import { Router } from "next/dist/client/router";

import "../../styles/globals.scss";
import { AppProps } from "next/dist/shared/lib/router/router";
import Layout from "../components/Layout";
import Header from "../components/Header";

const HashgeshApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    ReactGA.initialize("G-PBHF1JX21H");

    ReactGA.set({ page: "index.html" }); // Update the user's current page
    ReactGA.pageview("index.html"); // Record a pageview for the given page

    Router.events.on("routeChangeStart", (route: string) => {
      ReactGA.set({ page: route }); // Update the user's current page
      ReactGA.pageview(route); // Record a pageview for the given page
      console.log(route);
      return true;
    });
  });

  return (
    <>
      <Header></Header>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default HashgeshApp;
