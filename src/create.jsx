import { createSignal } from "solid-js"
import { fetchWebApi } from "./fetchSpotify";
import { useNavigate } from "@solidjs/router";


function Create() {
  const navigate = useNavigate()
  const [automatic, setAutomatic] = createSignal(false)
  const [numSongs, setNumSongs] = createSignal(2)

  console.log(automatic())

  return (
    <div className="flex-col" style={"width: 100%"}>

      <div className="card mb-2 mt-3">
        <label for="theme" className="mr-2">Theme:</label>
        <input id="theme" className="border border-black dark:border-white p-2 rounded-md text-lg w-7/12 h-8" style={``} placeholder="Beach Vibes"></input>
      </div>
      <label class="relative inline-flex items-center cursor-pointer mt-3">
        <input type="checkbox" value={automatic()} onClick={(evt) => setAutomatic(evt.value)} class="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-md font-medaum text-gray-900 dark:text-gray-300">Pick Songs Automatically</span>
      </label>
      <div className="w-1/2 text-center justify-center mx-auto">

        <input id="steps-range" type="range" min="1" max="5" value={numSongs()} step="1" onChange={(evt) => {
          setNumSongs(evt.value)
          console.log(evt)
        }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
        <label for="steps-range" className=" mb-2 text-sm font-medium text-gray-900 dark:text-white">Songs Per Player: {numSongs()}</label>

      </div>
      <div class="card mt-3">
        <button className="m-2" onClick={(evt) => {
          evt.preventDefault()
        }}>
          Create Game
        </button>
      </div>

    </div>
  )
}

export default Create

