

function Song({artistObject}) {
    return (
        <div className="song rounded-lg border border-black dark:border-white p-2 m-2 flex-grow col-auto">
            <div className="col-span-7 justify-center text-left">
                <p className="text-lg font-sans font-semibold">{artistObject.name}</p>
                <p className="subtitle">{artistObject.artists.map((a) => a.name)}</p>
            </div>
            <div className="col-span-3 text-right relative float-right bottom-14 left-1">
                <img className={"rounded-lg border border-x-2 border-y-2 border-gray-400 dark:border-white"} width={"60rem"} src={artistObject.album.images[0].url} />
            </div>
        </div>
    )
}

export default Song;