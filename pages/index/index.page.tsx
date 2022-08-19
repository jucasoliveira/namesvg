import React from 'react'
import { Counter } from './Counter'

export { Page }

function Page() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Welcome</h1>
      <div>
        <div>
          <div className="flex justify-center items-center">
                <input type="text" id="textInput" value="Example" className=" h-full focus:outline-none p-2 w-full mr-1 text-sm"/>
                <button id="textButton">Use Text</button>
          </div>
          </div>
          <div>
            <button id="randomButton">Random</button>
          </div>
      </div>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
