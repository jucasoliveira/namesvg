import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import { getAttributes } from "../../services/asset";
import { setRandomSeed, setSeed } from "../../services/numberGeneration";
import { AvatarPart } from "../../types/types";
import { AvatarStyleCount, PalettePreset, SVGFilter } from "../../utils/config";
import { DefaultBackgroundConfig, ShapeStyleMapping } from "../../utils/const";

export { Page };


function Page(pageProps: any) {
  // Search term
  const [searchTerm, setSearchTerm] = useState("");
  // API search results
  const [results, setResults] = useState<any>(null);
  // Searching status (whether there is pending API request)
  const [isSearching, setIsSearching] = useState(false);
  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const fetchImage = async () => {
    const options = {method: 'POST'};
    const response = await fetch(`http://localhost:3500/api/image/${searchTerm}`, options)
      .then(response => response.json())
      .then(response => response)
      .catch(err => console.error(err));
    setIsSearching(false);
    setResults(response);
  }

  const generatePreview = async () => {
    const config = { ...getAttributes() };
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const isFlipped = Math.random() > 0.5;

    const groups = await Promise.all(
      Object.keys(AvatarStyleCount).map(async (type) => {
        const fetchFile = await fetch(
          `/avatar/preview/${type}/${config[type as AvatarPart]}.svg`
        )
          .then((res) => res.text())
          .then((text) => text);

        var svgRaw = `${fetchFile}`;

        return `<g id="notion-avatar=${type}" ${
          type === "face" ? `fill="${color}"` : ""
        }  ${
          isFlipped ? 'transform="scale(-1,1) translate(-1080, 0)"' : ""
        }   > ${svgRaw.replace(/<svg.*(?=>)>/, "").replace("</svg>", "")}
      </g>`;
      })
    );

    const previewSvg =
      `<svg viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${SVGFilter}
        <g id="notion-avatar" filter="url(#filter)">
          ${groups.join("\n\n")}
        </g>
        </svg>`
        .trim()
        .replace(/(\n|\t)/g, "");

    const basePrice = 10;
    const randomBackground =
      (Math.random() * (100 - 0) + 0 < 40 &&
        PalettePreset[Math.floor(Math.random() * PalettePreset.length)]) ||
      "#999999";

    const price =
      basePrice +
      (config.beard ? config.beard : 0) +
      (config.accessories ? config.accessories : 0) +
      (config.glasses ? config.glasses : 0) +
      (randomBackground === "#999999" ? 0 : 20);

    return {
      previewSvg,
      isFlipped,
      attributes: config,
      price,
      randomBackground,
    };
  };


  const fetchSVG = async (isRandom: boolean = false) => {
    setIsSearching(true);
    isRandom && setRandomSeed();
    const preview = await generatePreview().then(preview => {
      return preview;
    });
    setIsSearching(false);
    setResults(preview);
  }

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        setSeed(searchTerm);
        fetchSVG(false);
      } else {
        setIsSearching(false);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );


  return <div className=' flex flex-col self-center justify-center items-center'>
      <h1 className="text-3xl font-bold underline self-center">Welcome</h1>
      <div className="mt-14">
        <div>
          <div className="flex self-center justify-center items-center">
            <div className="flex w-full items-center justify-center p-2">
              Type your name
            </div>
          <input type="text" id="textInput" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className=" items-center bg-white hover:border-black border-blue-400 rounded-lg border-[0.5px] h-full focus:outline-none p-2 w-full mr-1 text-sm"/>
          </div>
          </div>
          <div className="flex self-center justify-center items-center">
            <Button
            className="bg-blue-400 mt-12 h-12 w-32  hover:bg-black hover:!text-white hover:!border-blue-400 !border-black"
            id='randomButton'
            onClick={() => fetchSVG(true)}
          >
            <div className="flex items-center justify-center p-2">
              Random
            </div>
          </Button>
          </div>
          
      </div>
      <div className=" flex flex-col self-center justify-center items-center">
        {isSearching && <div>Loading Image ...</div>}
        {!isSearching && results && 
          <Card
            background={{
              color: results.randomBackground,
              shape: 'square',
            }}
            ShapeStyleMapping={ShapeStyleMapping}
            DefaultBackgroundConfig={DefaultBackgroundConfig}
            svgPreview={results}
          />
        }
      </div>
  </div>;
}

// Hook
function useDebounce(value: any, delay: any) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}