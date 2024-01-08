import { For, createEffect, createSignal } from "solid-js";

function Waiting({ gameInfo, playerInfo }) {
    const [playersPicking, setPlayersPicking] = createSignal([])

    console.log(gameInfo())
    console.log(playerInfo())

    createEffect(() => {
        setPlayersPicking(playerInfo().filter((player) => !Object.keys(gameInfo().songs).includes(player.spotifyId)))
    })




    return (
        <>
        <div className="font-light text-xl mt-10 mb-5">Still waiting for players to pick songs: </div>
            <For each={playersPicking()}>{(p, i) => {
                console.log(playersPicking())
                return (<div className="flex justify-center m-2">
                    <img className="rounded-full w-10 h-10 mr-2" src={p.img} />
                    <p className="text-lg font-light mt-1">{p.name}</p>
                </div>)
            }
            }
            </For>
        </>
    )

}

export default Waiting;