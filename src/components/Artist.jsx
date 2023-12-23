

function Artist({artistObject}) {
    return (
        <div className="song rounded-lg border border-black dark:border-white p-2 m-2 col-auto flex min-w-1/2 mx-10">
            <div className="col-span-4 justify-center text-left w-10/12 my-auto">
                <p className="text-lg font-sans font-semibold">{artistObject.name}</p>
            </div>
            <div className="col">
                <img className={"rounded-lg border border-x-2 border-y-2 border-gray-400 dark:border-white"} width={"60rem"} src={artistObject.images[0].url} />
            </div>
        </div>
    )
}

export default Artist;