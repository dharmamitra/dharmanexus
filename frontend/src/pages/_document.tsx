import React from "react";
import type { DocumentContext, DocumentProps } from "next/document";
import { Head, Html, Main, NextScript } from "next/document";
import i18nextConfig from "next-i18next.config";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
// https://mui.com/material-ui/integrations/nextjs/#pages-router
import {
  documentGetInitialProps,
  DocumentHeadTags,
  DocumentHeadTagsProps,
} from "@mui/material-nextjs/v15-pagesRouter";
import { getBasePath } from "@utils/deployments";

const makePublicPath = (path: string) => {
  return getBasePath() + path;
};

export default function MyDocument(
  props: DocumentProps & DocumentHeadTagsProps,
) {
  const currentLocale =
    props.__NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale;

  return (
    <Html lang={currentLocale}>
      <Head nonce={process.env.nonce}>
        <meta charSet="utf-8" />
        <DocumentHeadTags {...props} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__webpack_nonce__ = '${process.env.nonce}'`,
          }}
          nonce={process.env.nonce}
        />
        <meta property="csp-nonce" content={process.env.nonce} />
        <link rel="shortcut icon" href={makePublicPath("/favicon.ico")} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={makePublicPath("/apple-touch-icon.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={makePublicPath("/favicon-32x32.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={makePublicPath("/favicon-16x16.png")}
        />
        <link rel="manifest" href={makePublicPath("/site.webmanifest")} />
        <link
          rel="mask-icon"
          href={makePublicPath("/safari-pinned-tab.svg")}
          color="#361f0d"
        />
        <meta name="msapplication-TileColor" content="#361f0d" />
        <meta name="theme-color" content="#361f0d" />

        <meta name="theme-color" content="#361F0D" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#FFBC73"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#361F0D"
        />
        <meta name="emotion-insertion-point" content="" />
      </Head>

      <body>
        <InitColorSchemeScript
          defaultMode="system"
          modeStorageKey="mui-mode"
          colorSchemeStorageKey="mui-color-scheme"
          attribute="data-mui-color-scheme" // matches the provider default
        />
        <Main />
        <NextScript nonce={process.env.nonce} />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  return await documentGetInitialProps(ctx);
};
