import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import Card from "../../components/Card/Card";
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

  const fetchRandomImage = async () => {
    setIsSearching(true);
    const options = {method: 'POST'};
    const response = await fetch(`http://localhost:3500/api/random`, options)
      .then(response => response.json())
      .then(response => response)
      .catch(err => console.error(err));
    setIsSearching(false);
    setResults(response);
  }

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        fetchImage()
      } else {
        setIsSearching(false);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  const fetchSvgFIle = async () => {
      const fetchFile = await fetch(
        `./public/avatar/preview/face/7.svg`
      )
        .then((res) => res.text())
        .then((text) => text.replace(/fill="#ffffff"/, `fill="#${pageProps.backgroundColor}"`));
      console.log("fetchFile", fetchFile);
      return fetchFile;
  }

  useEffect(() => {
    fetchSvgFIle()
  },[])
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
            onClick={() => fetchRandomImage()}
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