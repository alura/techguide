import React from "react";
import Head from "next/head";
import { I18nProvider, useI18n } from "@src/infra/i18n";
import { ModalProviderWithActiveCard } from "@src/components/Modal/ModalProviderWithInitialCard";

export function CommonHead({ pageTitle }: { pageTitle?: string }) {
  const i18n = useI18n();

  const defaultTitle = i18n.content("HEAD.TITLE") as string;
  const title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
  const description = i18n.content("HEAD.DESCRIPTION") as string;
  const image = i18n.content("HEAD.SHARE_IMAGE") as string;
  return (
    <Head>
      {/* Favicon */}
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href="/assets/favicon/apple-icon-57x57.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="60x60"
        href="/assets/favicon/apple-icon-60x60.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href="/assets/favicon/apple-icon-72x72.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href="/assets/favicon/apple-icon-76x76.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/assets/favicon/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/assets/favicon/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/assets/favicon/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/assets/favicon/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/assets/favicon/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/assets/favicon/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/assets/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/assets/favicon/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/assets/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/assets/favicon/manifest.json" />
      <meta name="msapplication-TileColor" content="#0E1724" />
      <meta
        name="msapplication-TileImage"
        content="/assets/favicon/ms-icon-144x144.png"
      />
      <meta name="theme-color" content="#0E1724" />

      {/* <!-- Primary Meta Tags --> */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      {/* <meta property="og:url" content="https://metatags.io/" /> */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image" />
      {/* <meta property="twitter:url" content="https://metatags.io/" /> */}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Head>
  );
}

export function pageHOC<ComponentType>(Component: ComponentType) {
  return function PageHOC({ i18nKeys, ...props }: any) {
    const OutputComponent = Component as unknown as any;
    return (
      <I18nProvider locale={props.locale} keys={i18nKeys}>
        <ModalProviderWithActiveCard modalInitialData={props.modalInitialData}>
          <CommonHead pageTitle={props.pageTitle} />
          <OutputComponent {...props} />
        </ModalProviderWithActiveCard>
      </I18nProvider>
    );
  };
}
