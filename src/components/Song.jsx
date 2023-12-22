

function Song({songObject}) {
    return (
        <div className="song rounded-lg border border-black dark:border-white p-2 m-2 col-auto min-w-full">
            <div className="justify-center text-left w-9/12">
                <p className="text-lg font-sans font-semibold">{songObject.name}</p>
                <p className="subtitle">{songObject.artists.map((a) => a.name)}</p>
            </div>
            <div className="text-right relative float-right bottom-14 left-1">
                <img className={"rounded-lg border border-x-2 border-y-2 border-gray-400 dark:border-white"} width={"55rem"} src={songObject.album.images[0].url} />
            </div>
        </div>
    )
}

export default Song;