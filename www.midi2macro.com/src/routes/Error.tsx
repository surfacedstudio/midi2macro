import "bootstrap/dist/css/bootstrap.min.css";
import { MainNavbar } from "../components/main-navbar";
import { Footer } from "../components/footer";
import { useRouteError } from "react-router-dom";
import { App } from "../App";

export const ErrorRoute = () => {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <App>
      <img
        src="/error-logo.png"
        className="midi2macro-logo"
        width="320"
        alt="logo"
      />
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </App>
  );
};
