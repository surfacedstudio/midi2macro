import React, { PropsWithChildren, useEffect } from "react";
import logo from "../public/midi2macro-logo.png";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { MainNavbar } from "./components/main-navbar";
import { Footer } from "./components/footer";
import { Helmet } from "react-helmet";

type AppProps = PropsWithChildren & {};

export const App = ({ children }: AppProps) => {
  return (
    <div className="app">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Cats In Tech</title>
        <link rel="canonical" href="http://www.catsintech.com" />
      </Helmet>
      <MainNavbar />
      <div className="content-wrapper">{children}</div>
      <Footer />
    </div>
  );
};
