import { createSignal, createEffect, createResource, createMemo } from "solid-js";
import { fetchWebApi } from "./fetchSpotify";
import Select from "./Select";
import Song from "./song";

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


function SongPicker({ songs, setSongs }) {
    const [query, setQuery] = createSignal("");
    const [searchResults, setSearchResults] = createSignal([]);
    const slugQuery = createMemo(() => slugify(query()));

    const fetchSongs = async () => {
        const { items } = await fetchWebApi(
            `v1/search?q=${slugQuery()}&type=track&limit=10`,
            "GET"
        );
        console.log(items);
        return items;
    };

    const [searchResultsResource] = createResource(fetchSongs);

    createEffect(() => {
        setSearchResults(searchResultsResource());
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setQuery(e.target.value);
    };

    return (
        <div className="flex-col w-full">
            <input className="w-1/2"
                value={query()}
                onChange={handleSearch}
            ></input>
            <For each={searchResults()}>{(s, i) =>
                <div className="w-1/2" onClick={(evt) => {
                    evt.preventDefault()
                    setSongs(s)
                }}>
                    <Song songObject={s}></Song>
                </div>
            }
            </For>
        </div>
    )
}

export default SongPicker;