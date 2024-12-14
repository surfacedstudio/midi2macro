import { useEffect, useState } from "react";
import { App } from "../App";
import type { MyType } from "@infra/types";
import { apiClient } from "src/utils/api-client";

export const HomeRoute = () => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const loadStuff = async () => {
      const response = await apiClient.root.get(null);

      if (response.status !== 200) {
        setData("Error: " + response.statusText);
      } else {
        setData(JSON.stringify(response.body?.message));
      }
    };
    loadStuff();
  }, []);

  return (
    <App>
      <img
        src="/midi2macro-logo.png"
        className="midi2macro-logo"
        width="320"
        alt="logo"
      />
      <div className="heading">Cats In Tech 2</div>
      <div className="subtitle">Smart Tools for Creative People</div>
      <div>{data}</div>
    </App>
  );
};
