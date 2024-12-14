import type { RootInput, RootOutput } from "@infra/types";
import { buildSafeFetch } from "@surfacedstudio/core/client";

export const apiClient = {
  root: {
    get: buildSafeFetch<RootInput, RootOutput>(
      "https://api-dev.catsintech.com",
      "GET"
    ),
  },
};
