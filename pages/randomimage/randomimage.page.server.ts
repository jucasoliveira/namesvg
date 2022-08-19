import { generatePreview } from "../../services/randomImage";

export async function onBeforeRender(pageContext) {
  let generateImages = null;
  const preview = await generatePreview();

  generateImages = {
    preview,
    randomBackground: preview.randomBackground,
  };

  const pageProps = { generateImages };

  // We make `pageProps` available as `p ageContext.pageProps`
  return {
    pageContext: {
      pageProps,
    },
  };
}

// By default `pageContext` is available only on the server. But our hydrate function
// we defined earlier runs in the browser and needs `pageContext.pageProps`; we use
// `passToClient` to tell `vite-plugin-ssr` to serialize and make `pageContext.pageProps`
// available to the browser.
export const passToClient = ["pageProps"];
