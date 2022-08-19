export async function onBeforeRender(pageContext) {
  const pageProps = {};

  return {
    pageContext: {
      pageProps,
    },
  };
}

export const passToClient = ["pageProps"];
