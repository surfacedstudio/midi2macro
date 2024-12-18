import type { RootInput, RootOutput } from "@infra/types";
// import { buildSafeFetch } from "@surfacedstudio/core/client";

export const apiClient = {
  root: {
    get: (data: any) => ({} as any), //buildSafeFetch<RootInput, RootOutput>("https://api-dev.midi2macro.com", "GET"),
  },
};
