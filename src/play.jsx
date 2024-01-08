import { createResource, createEffect, createSignal, createMemo } from "solid-js"
import { fetchWebApi } from "./fetchSpotify";
import { useNavigate } from "@solidjs/router";
import { useParams } from "@solidjs/router";
import { supabase } from "./supabaseClient";
import GameSetup from "./components/gameSetup";
import SongPicker from "./components/songPicker";
import Waiting from "./components/Waiting";



function Play() {

  const navigate = useNavigate()
  const [userId, setUserId] = createSignal([])
  const [players, setPlayers] = createSignal([])
  const [playerInfo, setPlayerInfo] = createSignal([])
  const [playerSongs, setPlayerSongs] = createSignal([])
  const [gameInfo, setGameInfo] = createSignal([])
  const [isHost, setIsHost] = createSignal(false)
  const fetchUserInfo = async () => (await fetchWebApi('v1/me', 'GET'));
  const [userInfo] = createResource(fetchUserInfo);


  const songsPicked = createMemo(() => {
    console.log(gameInfo().songs)
    if (gameInfo().songs) {
      console.log(gameInfo())
      return Object.values(gameInfo().songs).flat()
    } else return []
  }, []
  )


  const params = useParams();

  const getGameInfo = async () => {
    const { data, error } = await supabase
      .from('games')
      .select(`*`)
      .eq('gamecode', params.gamecode)
      .single()
    if (error) {
      throw error
    }
    return data
  }

  getGameInfo().then((data) => {
    setGameInfo(data)
  })


  createEffect(() => {
    if (userInfo() && gameInfo() && userInfo().id === gameInfo().hostid) {
      setIsHost(true)
    }
  })

  const handleRecordUpdated = (payload) => {
    console.log('Change received!', payload)

    setGameInfo(payload.new)
    setPlayers(payload.new.playerids)

  }

  const gameTable = supabase
    .channel(`game:${params.gamecode}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `gamecode=eq.${params.gamecode}` }, handleRecordUpdated)
    .subscribe()


  const updatePlayers = async () => {
    await supabase.from('games').update({ playerids: players() }).eq('gamecode', params.gamecode)
  }

  const getPlayers = async () => {
    const { data, error } = await supabase
      .from('games')
      .select(`playerids`)
      .eq('gamecode', params.gamecode)
      .single()
    if (error) {
      throw error
    }
    return data.playerids
  }

  getPlayers().then((data) => {
    if (userInfo().id) {
      setUserId(userInfo().id)
      if (data === null) data = []
      if (!data.includes(userInfo().id)) {
        console.log('adding hostid')
        setPlayers([...data, userInfo().id])
        updatePlayers()
      } else {
        setPlayers(data)
      }
    }
  })

  const getPlayerInfos = async () => {
    const { data, error } = await supabase
      .from('player')
      .select(`*`)
      .in('spotifyId', players())
    if (error) {
      throw error
    }
    console.log(data)
    return data
  }

  createEffect(() => {
    getPlayerInfos().then((data) => {
      setPlayerInfo(data)
      console.log(playerInfo())
    })
  })

  createEffect(async () => {
    if (isHost() && gameInfo().status === 'picking') {
      if (Object.keys(gameInfo().songs).length === players().length) {
        const {error} = await supabase.from('games').update({ status: 'playing' }).eq('gamecode', params.gamecode)
      }
      console.log(error)
    }
  })


  return (
    <div className="flex-col w-full xs:w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
     
      <Show when={gameInfo().status === "waiting"}>
          <GameSetup gamecode={params.gamecode} players={players} playerInfo={playerInfo} isHost={isHost} gameInfo={gameInfo}></GameSetup>
      </Show>
      <Show when={gameInfo().status === "picking" && !Object.keys(gameInfo().songs).includes(userId())}>
          <SongPicker userId={userId} gameInfo={gameInfo} songs={playerSongs} setSongs={setPlayerSongs} songsPicked={songsPicked}></SongPicker>
      </Show>
      <Show when={gameInfo().status === "picking" && Object.keys(gameInfo().songs).includes(userId())}>
          <Waiting gameInfo={gameInfo} playerInfo={playerInfo}></Waiting>
      </Show>
      <Show when={gameInfo().status === "playing"}>
          <p className="text-xl mt-5">Playing:</p>
          <p className="font-extralight">Select the player you think picked this song!</p>
      </Show>
    </div>
  )
}

export default Play

