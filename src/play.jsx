import { createResource, createEffect, createSignal } from "solid-js"
import { fetchWebApi } from "./fetchSpotify";
import { useNavigate } from "@solidjs/router";
import { useParams } from "@solidjs/router";
import { supabase } from "./supabaseClient";
import GameSetup from "./components/gameSetup";



function Play() {

  const navigate = useNavigate()
  const [players, setPlayers] = createSignal([])
  const [playerInfo, setPlayerInfo] = createSignal([])
  const [gameInfo, setGameInfo] = createSignal([])
  const [isHost, setIsHost] = createSignal(false)
  const fetchUserInfo = async () => (await fetchWebApi('v1/me', 'GET'));
  const [userInfo] = createResource(fetchUserInfo);



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
    console.log(userInfo())

    if (userInfo() && gameInfo() && userInfo().id === gameInfo().hostid) {
      setIsHost(true)
    }
  })



  const handleRecordUpdated = (payload) => {
    console.log('Change received!', payload)
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
      console.log(userInfo().id)
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
    return data
  }

  createEffect(() => {
    getPlayerInfos().then((data) => {
      setPlayerInfo(data)
    })
  })


  return (
    <div className="flex-col w-full xs:w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
      <GameSetup gamecode={params.gamecode} players={players} playerInfo={playerInfo} isHost={isHost} gameInfo={gameInfo}></GameSetup>
    </div>
  )
}

export default Play

