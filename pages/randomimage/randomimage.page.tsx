import React from "react";
import Card from "../../components/Card/Card";
import { DefaultBackgroundConfig, ShapeStyleMapping } from "../../utils/const";

export { Page };

interface PageProps{
  generateImages: any
}

function Page(pageProps: PageProps) {
  const { generateImages } = pageProps;
  const [text, setText] = React.useState("Example");
  return <>
      <h1 className="text-3xl font-bold underline">Reload to get Random Image</h1>
      <Card
        background={{
          color: generateImages.randomBackground,
          shape: 'square',
        }}
        ShapeStyleMapping={ShapeStyleMapping}
        DefaultBackgroundConfig={DefaultBackgroundConfig}
        svgPreview={generateImages.preview}
      />
  </>;
}