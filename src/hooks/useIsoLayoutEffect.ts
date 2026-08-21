import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect that no-ops on the server to avoid SSR warnings. */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
