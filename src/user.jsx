import { ErrorBoundary, createResource, Suspense, createEffect, createSignal } from "solid-js"
import { fetchWebApi } from "./fetchSpotify";
import { useNavigate } from "@solidjs/router";
import Song from "./components/song"
import Artist from "./components/Artist";
import { supabase } from "./supabaseClient";

function User() {

  const navigate = useNavigate()
  const [gamecode,setGamecode] = createSignal('')

  const getProfile = async (spotId) => {
    try {
      const { data, error, status } = await supabase
        .from('player')
        .select(`spotifyId`)
        .eq('spotifyId', spotId)
  
      if (error && status !== 406) {
        throw error
      }
  
      if (data.length === 0) {
        updateProfile(userInfo())

      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }

  createEffect(() => {
    if (userInfo()) {
      getProfile(userInfo().id)
    }
  })


  
  const updateProfile = async () => {
  
    try {
      const playerData = {
        spotifyId: userInfo().id,
        name: userInfo().display_name,
        img: userInfo().images[0].url,
      }
      const { error } = await supabase.from('player').upsert(playerData)
  
      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }

  const fetchUserInfo = async () => (await fetchWebApi('v1/me', 'GET'));
  const [userInfo] = createResource(fetchUserInfo);
  

  const fetchTopSongs = async () => (await fetchWebApi('v1/me/top/tracks?time_range=long_term&limit=5', 'GET'));
  const [topSongs] = createResource(fetchTopSongs);

  const fetchTopArtists = async () => (await fetchWebApi('v1/me/top/artists?time_range=long_term&limit=5', 'GET'));
  const [topArtists] = createResource(fetchTopArtists);

  return (
    <div className="flex-col w-full xs:w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
      <ErrorBoundary fallback={<><button className="btn my-auto mt-10"
      onClick={(evt) => {
        evt.preventDefault()
        navigate('/')
      }}>Please reauthorize Spotify</button></>}>
      <div className="text-xl text-right font-semibold object-cover p-4 pb-10 flex-row relative">
        {userInfo() && <div><p className="relative right-12">{userInfo().display_name.split(' ')[0]}
        </p>
          <img className="rounded-full float-right ml-2 relative bottom-8"
            src={userInfo().images[0].url} width={"40rem"} height={"40rem"} />
        </div>}
      </div>
      <div className="card mb-2">
        <input className="border border-black dark:border-white p-2 rounded-md text-lg w-4/12" style={`maxWidth: 50rem`} 
        placeholder="WZYX"
        value={gamecode()}
        onChange={(evt) => setGamecode(evt.target.value)}
        >
        
        </input>
      </div>
      <div class="card mt-3">
        <button className="m-2" onClick={(evt) => {
          evt.preventDefault()
          navigate(`/play/${gamecode()}`)
        }}>
          Join Game
        </button>
      </div>
      <div class="card">
        <button className="m-2" onClick={(evt) => {
          evt.preventDefault()
          navigate('/create')
        }}>
          Create Game
        </button>
      </div>

      <div className="mt-3">
        <p className="text-lg font-light">Your Top Songs:</p>
        <div className="flex-inline text-right">
          <ErrorBoundary fallback={<p className="my-2 text-center">Error with authorization</p>}>
            <Suspense fallback={<p className="my-2 text-center">Loading...</p>}>
              {topSongs() && topSongs().items?.map((item) => <Song songObject={item} />)}
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      <div className="mt-0 mb-10">
        <p className="w-full text-lg font-light flex justify-center">Your Top Artists:</p>
        <div className="flex-inline text-right">
          <ErrorBoundary fallback={<p className="my-2 text-center">Error with authorization</p>}>
            <Suspense fallback={<p className="my-2 text-center">Loading...</p>}>
              {topArtists() && topArtists().items?.map((item) => <Artist artistObject={item} />)}
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      </ErrorBoundary>
    </div>
  )
}

export default User

