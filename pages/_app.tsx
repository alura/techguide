import React from "react";
import type { AppProps } from "next/app";
import GlobalStyle from "@src/theme/GlobalStyle";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
