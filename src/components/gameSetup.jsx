import {Show, ErrorBoundary} from "solid-js"
import { supabase } from "../supabaseClient"

function GameSetup({gamecode, players, playerInfo, isHost, gameInfo}) {

    async function startGame() {
        const { error } = await supabase.from('games').update({status: 'picking'}).match({gamecode: gamecode})
    }

    return (
        <>
    <div className="card mb-2 mt-5 text-3xl">
        <p className="text-xl">Gamecode:</p><p className="font-bold">{gamecode}</p>
      </div>
      <div className="text-xl mb-3">
        <p>Theme:</p> <p className="font-bold">{gameInfo().theme}</p>
      </div>
      <p className="border"></p>
      <div className="mt-3">
        <p className="text-lg font-light mb-5">Waiting for players:</p>
        <div className="flex-inline text-right">
          <ErrorBoundary fallback={<p className="my-2 text-center">Error with authorization</p>}>
            <Suspense fallback={<p className="my-2 text-center">Loading...</p>}>
              {playerInfo().map((player) => {
                return (
                  <div className="flex justify-center m-2">
                    <img className="rounded-full w-10 h-10 mr-2" src={player.img} />
                    <p className="text-lg font-light mt-1">{player.name}</p>
                  </div>
                )}
              )}
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      <Show when={isHost()}>
        <div class="card mt-5">
          <button className="m-2 disabled:text-opacity-50" disabled={players().length >= 3} onClick={(evt) => {
            evt.preventDefault()
            startGame()
          }}>
            Start Game
          </button>
        </div>
      </Show>
      </>
    )
}

export default GameSetup;