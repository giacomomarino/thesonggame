import { createResource, createSignal } from "solid-js"
import { fetchWebApi } from "./fetchSpotify";
import Song from "./components/song"

function User() {
    const fetchTopSongs = async () => (await fetchWebApi('v1/me/top/tracks?time_range=long_term&limit=5', 'GET'));
    const [topSongs] = createResource(fetchTopSongs);

    const fetchUserInfo = async () => (await fetchWebApi('v1/me', 'GET'));
    const [userInfo] = createResource(fetchUserInfo);
    return (
      <div className="flex-col">
        <p className="text-3xl font-semibold items-start mb-10">Hello {userInfo() && <>{userInfo().display_name}!</>}</p>
        
        <div className="m-10">
          <p className="text-lg font-light">Your Top Songs:</p>
          {topSongs.loading && <>Loading top songs...</>}
          {topSongs.error && <>Error loading top songs :/...</>}
          <div className="flex-inline text-right">
            {topSongs() && topSongs().items.map((item) => <Song artistObject={item} />)}
          </div>
        </div>
      </div>
    )
  }
  
  export default User

