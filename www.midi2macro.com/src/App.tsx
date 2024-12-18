import React, { PropsWithChildren, useEffect } from "react";
import logo from "../public/midi2macro-logo.png";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { MainNavbar } from "./components_old/main-navbar";
import { Footer } from "./components_old/footer";
import { Helmet } from "react-helmet";
import { StyledEngineProvider } from "@mui/material/styles";

type AppProps = PropsWithChildren & {};

export const App = ({ children }: AppProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <div className="app">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Midi 2 Macro</title>
          <link rel="canonical" href="http://www.midi2macro.com" />
        </Helmet>
        <MainNavbar />
        <div className="content-wrapper">{children}</div>
        <Footer />
      </div>
    </StyledEngineProvider>
  );
};
