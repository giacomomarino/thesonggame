import { createSignal, Show, batch } from "solid-js"
import { useNavigate } from "@solidjs/router";
import Select from "./components/Select";

const dateOptions = [{ name: 'All Time', value: 'long_term' }, { name: 'Last 6 Months', value: 'medium_term' }, { name: 'Last Month', value: 'short_term' }]

function Create() {
  const navigate = useNavigate()

  const [automatic, setAutomatic] = createSignal(true)
  const [numSongs, setNumSongs] = createSignal(2)
  const [numToSelectFrom, setNumToSelectFrom] = createSignal(2)
  const [useTopSongs, setUseTopSongs] = createSignal(true)
  const [useDateRange, setUseDateRange] = createSignal('long_term')


  let selector;

  return (
    <div className="flex-col justify-center w-full xs:w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
      <div className="card mb-2 mt-3">
        <label for="theme" className="mr-2">Theme:</label>
        <input id="theme" className="border border-black dark:border-white p-2 rounded-md text-lg w-7/12 h-8" placeholder="At the Beach"></input>
      </div>
      <label class="relative inline-flex items-center cursor-pointer mt-5">
        <input type="checkbox" checked={automatic()} onChange={(evt) => {
          evt.preventDefault()
          batch(() => {
            setAutomatic(evt.target.checked)
            setUseTopSongs(true)
          })
        }
        } class="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-md font-medaum text-gray-900 dark:text-gray-300">Pick Songs Automatically</span>
      </label>
      <div className="w-1/2 text-center justify-center mx-auto mt-5">

        <input id="num-songs" type="range" min="1" max="5" value={numSongs()} step="1" onChange={(evt) => {
          evt.preventDefault()
          batch(() => {
            setNumSongs(evt.target.value)
            setUseTopSongs(true)
          })

          if (numSongs() > numToSelectFrom()) {
            setNumToSelectFrom(numSongs())
          }
        }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
        <label for="num-songs" className=" mb-2 text-sm font-medium text-gray-900 dark:text-white">Songs Per Player: {numSongs()}</label>
      </div>
      <Show
        when={automatic()}
        fallback={<></>}
      >
        <label class="relative inline-flex items-center cursor-pointer mt-5">
          <input type="checkbox" checked={useTopSongs()} onChange={(evt) => {
            evt.preventDefault()
            setUseTopSongs(evt.target.checked)
          }
          } class="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-md font-medaum text-gray-900 dark:text-gray-300">Use Top Songs</span>
        </label>
        <div className="justify-center my-3 mx-auto w-1/2">
          <Select selectedValue={useDateRange} setSelectedValue={setUseDateRange} options={dateOptions} />
        </div>
        <div className="w-1/2 text-center justify-center mx-auto mt-5">

          <input id="num-songs" type="range" min={numSongs()} max="50" value={numToSelectFrom()} step="1" onChange={(evt) => {
            evt.preventDefault()
            setNumToSelectFrom(evt.target.value)
            setUseTopSongs(true)
          }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
          <label for="num-songs" className=" mb-2 text-sm font-medium text-gray-900 dark:text-white">Songs to Pick from: {numToSelectFrom()}</label>
        </div>
      </Show>



      <div class="card mt-3">
        <button className="m-2" onClick={(evt) => {
          evt.preventDefault()
          navigate('/play')
        }}>
          Create Game
        </button>
      </div>

    </div>
  )
}

export default Create

