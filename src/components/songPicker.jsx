import { createSignal, createEffect, createResource, createMemo } from "solid-js";
import { fetchWebApi } from "../fetchSpotify"
import { supabase } from "../supabaseClient";
import Song from "./Song";

function slugify(input) {
    if (!input)
        return '';

    // make lower case and trim
    var slug = input.toLowerCase().trim();

    // remove accents from charaters
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    // replace invalid chars with spaces
    slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();

    // replace multiple spaces or hyphens with a single hyphen
    slug = slug.replace(/[\s-]+/g, '-');

    return slug;
}


function SongPicker({ userId, gameInfo, songs, setSongs, songsPicked }) {
    const [query, setQuery] = createSignal("");
    const slugQuery = createMemo(() => slugify(query()));
    const submitSongs = async () => {
        const { error } = await supabase.from('games').update({ songs: {
            ...gameInfo().songs,
            [userId()]: songs().map((song) => song.id)
        } }).match({ gamecode: gameInfo().gamecode })
        console.log(error)
    }

    const fetchSongs = async () => {
        if (slugQuery() === "") return [];
        const result = await fetchWebApi(
            `v1/search?q=${slugQuery()}&type=track&limit=10`,
            "GET"
        );
        console.log(result.tracks.items)
        return result.tracks.items;
    };

    const [searchResultsResource] = createResource(query, fetchSongs);


    const handleSearch = (e) => {
        e.preventDefault();
        console.log(e.target.value)
        setQuery(e.target.value);
    };

    console.log(gameInfo())
    return (
        <div className="flex flex-col m-5 mx-auto">
            <div>
            <p className="mb-5">Picked Songs: {songs().length} / {gameInfo().numsongs}</p>
            <For each={songs()}>{(pickedSong, i) => {
                return (
                <div className="w-full" onClick={(evt) => {
                    evt.preventDefault()
                    setSongs(songs().filter((song) => song.id !== pickedSong.id))
                }}>
                    <Song songObject={pickedSong}></Song>
                </div>)
            }}
            </For>
            </div>
            <Show when={songs().length < gameInfo().numsongs}>
                <div className="">
                <label className="mr-2" for="search">Search:</label>
                <input className="w-1/2 rounded-lg p-2 mt-5" id="search"
                    value={query()}
                    onChange={handleSearch}
                    onInput={handleSearch}
                ></input>
                <For each={searchResultsResource()}>{(s, i) => {
                    return (<div className="w-full" onClick={(evt) => {
                        evt.preventDefault()
                        if (songsPicked().includes(s.id)) {
                            alert("This song has already been picked!")
                            return
                        } else if (songs().includes(s.id)) {
                            alert("You already selected this song!")
                            return
                        } else {
                            setSongs([...songs(), s])
                            setQuery("")
                        }
                    }}>
                        <Song songObject={s}></Song>
                    </div>)
                }}
                </For>
                </div>
            </Show>
            <Show when={songs().length == gameInfo().numsongs}>
                <div className="text-center">
                    <button 
                    onClick={(evt) => {
                        evt.preventDefault()
                        submitSongs()
                    }}>
                        Submit Songs
                    </button>
                </div>
            </Show>
        </div >
    )
}

export default SongPicker;