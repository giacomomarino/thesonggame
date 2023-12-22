import { createResource, createSignal } from "solid-js"
import { fetchWebApi } from "./fetchSpotify";
import Song from "./components/song"
import Artist from "./components/Artist";

function User() {

  const fetchTopSongs = async () => (await fetchWebApi('v1/me/top/tracks?time_range=long_term&limit=5', 'GET'));
  const [topSongs] = createResource(fetchTopSongs);

  const fetchTopArtists = async () => (await fetchWebApi('v1/me/top/artists?time_range=long_term&limit=5', 'GET'));
  const [topArtists] = createResource(fetchTopArtists);

  const fetchUserInfo = async () => (await fetchWebApi('v1/me', 'GET'));
  const [userInfo] = createResource(fetchUserInfo);
  return (
    <div className="flex-col mx-0">
      <p className="text-3xl font-semibold items-start mb-10">Hello {userInfo() && <>{userInfo().display_name.split(' ')[0]}!</>}</p>
      <div className="card mb-2">
        <input className="border border-black dark:border-white p-2 rounded-md text-lg w-4/12" style={`maxWidth: 2rem`} placeholder="WZYX"></input>
      </div>
      <div class="card">

        <button className="m-2" onClick={(evt) => {
          evt.preventDefault()
        }}>
          Join Game
        </button>
      </div>
      <div class="card">
        <button className="m-2" onClick={(evt) => {
          evt.preventDefault()
        }}>
          Create Game
        </button>
      </div>


      <div className="mt-3">
        <p className="text-lg font-light">Your Top Songs:</p>
        {topSongs.loading && <>Loading top songs...</>}
        {topSongs.error && <>Error loading top songs :/...</>}
        <div className="flex-inline text-right">
          {topSongs() && topSongs().items?.map((item) => <Song songObject={item} />)}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-lg font-light inline-flex mx-auto ml-7">Your Top Artists:</p>
        {topSongs.loading && <>Loading top artists...</>}
        {topSongs.error && <>Error loading top artists :/...</>}
        <div className="flex-inline text-right">
          {topArtists() && topArtists().items?.map((item) => <Artist artistObject={item} />)}
        </div>
      </div>
    </div>
  )
}

export default User

