import {
  For,
  createEffect,
  createMemo,
  createSignal,
  createResource,
} from "solid-js";
import Song from "./Song";
import { fetchWebApi } from "../fetchSpotify";
import {AiOutlineArrowLeft} from "solid-icons/ai"
import { useNavigate } from "@solidjs/router";

function Result({ gameInfo, playerInfo }) {
  const navigate = useNavigate()
  const scores = gameInfo().scores;
  const songs = gameInfo().songs;
  const [loaded, setLoaded] = createSignal(false);

  // Calculate results...
  const voteCounts = Object.keys(scores).reduce((acc, userId) => {
    acc[userId] = 0;
    return acc;
    }, {});
  const songGuessCounts = {};

  for (const [userId, userScores] of Object.entries(scores)) {
    for (const [songId, votedUserId] of Object.entries(userScores)) {
      if (songs[votedUserId].includes(songId)) {
        voteCounts[userId] = (voteCounts[userId] || 0) + 1;
        songGuessCounts[songId] = (songGuessCounts[songId] || 0) + 1;
      }
    }
  }

  const playerWithMostCorrectVotes = createMemo(
    () =>
      Object.keys(voteCounts).reduce(
        (a, b) => (voteCounts[a] > voteCounts[b] ? a : b),
        ""
      ),
    []
  );
  const mostElusivePlayer = createMemo(
    () =>
      Object.keys(voteCounts).reduce(
        (a, b) => (voteCounts[a] < voteCounts[b] ? a : b),
        ""
      ),
    []
  );
  const mostElusiveSong = createMemo(
    () =>
      Object.keys(songGuessCounts).reduce(
        (a, b) => (songGuessCounts[a] < songGuessCounts[b] ? a : b),
        ""
      ),
    []
  );

  const fetchSong = async () =>
    await fetchWebApi(`v1/tracks/${mostElusiveSong()}`, "GET");
  const [elusiveSong] = createResource(fetchSong);
  const sortedVoteCounts = createMemo(
    () => Object.entries(voteCounts).sort((a, b) => b[1] - a[1]),
    []
  );

  const mostGuessedPlayer = createMemo(
    () =>
      Object.keys(voteCounts).reduce(
        (a, b) => (voteCounts[a] > voteCounts[b] ? a : b),
        ""
      ),
    []
  );

  console.log(playerInfo());
  var playerInfos = {};
  createEffect(() => {
    if (playerInfo().length > 0) {
      playerInfo().forEach((player) => {
        playerInfos[player.spotifyId] = player;
      });
      console.log(playerInfos);
      setLoaded(true);
    }
  });

  console.log(scores)

  return (
    <div>
      <div className="text-xl text-right font-semibold object-cover p-4 pb-2 flex-row relative">
        <AiOutlineArrowLeft className="relative top-0" size={30} onClick={
          (evt) => {
            evt.preventDefault()
            navigate('/user')
          }
        } />
      </div>
      <h1 class="font-extralight mt-5">Results</h1>
      <Show when={loaded()}>
        <div className="border border-white rounded-md p-2 min-w-1/2 mx-10 my-5">
          <p className="text-xl">Winner: </p>
          <div className="flex justify-center m-2">
            <img
              className="rounded-full w-10 h-10 mr-2"
              src={playerInfos[playerWithMostCorrectVotes()]?.img}
            />
            <p className="text-lg font-light mt-1">
              {playerInfos[playerWithMostCorrectVotes()]?.name}
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-extralight">Scores:</h2>
        <ul>
          <For each={sortedVoteCounts()}>
            {([userId, count]) => {
              console.log(playerInfos);
              console.log(sortedVoteCounts())
              return (
                <li>
                  <div className="flex justify-center m-2">
                    <img
                      className="rounded-full w-10 h-10 mr-2"
                      src={playerInfos[userId]?.img}
                    />
                    <p className="text-lg font-light mt-1">
                      {playerInfos[userId]?.name}:{" "}
                      <span class="font-extrabold">{count}</span>
                    </p>
                  </div>
                </li>
              );
            }}
          </For>
        </ul>
        <div className="border border-white rounded-md p-1 min-w-1/2 mx-10 my-5">
          <p>Most elusive player:</p>
          <div className="flex justify-center m-2">
            <img
              className="rounded-full w-10 h-10 mr-2"
              src={playerInfos[mostElusivePlayer()]?.img}
            />
            <p className="text-lg font-light mt-1">
              {playerInfos[mostElusivePlayer()]?.name}
            </p>
          </div>
        </div>
        <div className="border border-white rounded-md p-1 min-w-1/2 mx-10 my-5">
          <p>Most guessed player:</p>
          <div className="flex justify-center m-2">
            <img
              className="rounded-full w-10 h-10 mr-2"
              src={playerInfos[mostGuessedPlayer()]?.img}
            />
            <p className="text-lg font-light mt-1">
              {playerInfos[mostGuessedPlayer()]?.name}
            </p>
          </div>
        </div>
      </Show>
      <Show when={elusiveSong()}>
        <p>Most elusive song:</p>
        <Song songObject={elusiveSong()} />
      </Show>
    </div>
  );
}

export default Result;
