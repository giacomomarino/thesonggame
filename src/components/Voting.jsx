import { Show, createSignal, createEffect } from "solid-js";
import WebPlayback from "./WebPlayback";
import { supabase } from "../supabaseClient";
import { useEffect } from "react";

function Voting({ gameInfo, playerInfo, userId }) {
  const [voted, setVoted] = createSignal(false);
  const [currSong, setCurrSong] = createSignal(gameInfo().currentsong);

  const submitSongs = async (playerVotedFor) => {
    const { error } = await supabase
      .from("games")
      .update({
        scores: {
          ...gameInfo().scores,
          [userId()]: {
            ...gameInfo().scores[userId()],
            [gameInfo().currentsong]: playerVotedFor,
          },
        },
      })
      .match({ gamecode: gameInfo().gamecode });
    console.log(error);
  };

  createEffect(() => {
    if (currSong() !== gameInfo().currentsong) {
      setVoted(false);
      setCurrSong(gameInfo().currentsong);
    }
  });

  return (
    <>
      <div>
        <p className="m-10 font-extralight text-xl">
          Vote for who you think picked the song!
        </p>
      </div>
      <WebPlayback gameInfo={gameInfo} />
      <Show
        when={!voted()}
        fallback={<>Waiting for other players to vote...</>}
      >
        <div className="flex flex-col justify-center">
          {playerInfo().map((player) => {
            return (
              <button
                className="flex justify-center m-2"
                onClick={() => {
                  submitSongs(player.spotifyId);
                  setVoted(true);
                }}
              >
                <img className="rounded-full w-10 h-10 mr-2" src={player.img} />
                <p className="text-lg font-light mt-1">{player.name}</p>
              </button>
            );
          })}
        </div>
      </Show>
    </>
  );
}

export default Voting;
