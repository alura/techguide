import React from "react";
import Head from "next/head";
import { I18nProvider, useI18n } from "@src/infra/i18n";
import { ModalProviderWithActiveBlock } from "@src/components/Modal/ModalProviderWithInitialBlock";

export function CommonHead({ pageTitle }: { pageTitle?: string }) {
  const i18n = useI18n();

  const defaultTitle = i18n.content("HEAD.TITLE") as string;
  const title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
  const description = i18n.content("HEAD.DESCRIPTION") as string;
  const image = i18n.content("HEAD.SHARE_IMAGE") as string;
  return (
    <Head>
      {/* Favicon */}
      <link rel="manifest" href="/assets/favicon/site.webmanifest" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/assets/favicon/apple-touch-icon.png"
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
        sizes="16x16"
        href="/assets/favicon/favicon-16x16.png"
      />

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
      <I18nProvider keys={i18nKeys}>
        <ModalProviderWithActiveBlock modalInitialData={props.modalInitialData}>
          <CommonHead pageTitle={props.pageTitle} />
          <OutputComponent {...props} />
        </ModalProviderWithActiveBlock>
      </I18nProvider>
    );
  };
}
