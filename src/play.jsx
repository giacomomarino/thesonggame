import { createResource, createEffect, createSignal, createMemo } from "solid-js"
import { useNavigate } from "@solidjs/router";
import { fetchWebApi } from "./fetchSpotify";
import { useParams } from "@solidjs/router";
import { supabase } from "./supabaseClient";
import GameSetup from "./components/gameSetup";
import SongPicker from "./components/songPicker";
import Waiting from "./components/Waiting";
import Voting from "./components/Voting";
import Result from "./components/Result";

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


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
      return shuffle(Object.values(gameInfo().songs).flat())
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

  const handleRecordUpdated = async (payload) => {
    console.log('Change received!', payload)

    setGameInfo(payload.new)
    setPlayers(payload.new.playerids)
    console.log(payload.new)
    if (payload.new.status === 'playing') {
      console.log(payload.new.scores)
      var votes = 0
      Object.keys(payload.new.scores).forEach((player) => {
        if (payload.new.scores[player][payload.new.currentsong]  ) {
          votes += 1
        }
      })
      if (votes == payload.new.playerids.length) {
        var options = []
        Object.values(gameInfo().songs).forEach((userSongs) => {
          options.push(...userSongs)
        })
        var played;
        if (gameInfo().songsplayed) {
          console.log('here')
          const prevSongs = gameInfo().songsplayed.filter((song) => song)
          played = [...prevSongs, gameInfo().currentSong]
        } else { 
          played = [gameInfo().currentsong]
        }
        options = options.filter((song) => !played.includes(song))
        console.log(options)
        console.log("current song", gameInfo().currentsong)
        console.log(options.length)
        if (options.length > 0) {
          console.log('hereere')
          
          console.log('setting song', options.at(0))
          const {error} = await supabase.from('games').update({ currentsong: options.at(0), songsplayed: [options.at(0), ...played] }).eq('gamecode', params.gamecode)
          console.log(error)
        } else {
          const {error} = await supabase.from('games').update({ status: 'results' }).eq('gamecode', params.gamecode)
          console.log(error)
        }
      }
    }

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
        const {error: error2} = await supabase.from('games').update({ currentsong: songsPicked().at(0) }).eq('gamecode', params.gamecode)
      }
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
          <Voting gameInfo={gameInfo} playerInfo={playerInfo} userId={userId}/>
      </Show>
      <Show when={gameInfo().status === "results"}>
          <Result gameInfo={gameInfo} playerInfo={playerInfo}></Result>
      </Show>
    </div>
  )
}

export default Play

