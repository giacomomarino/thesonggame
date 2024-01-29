import { onMount, createSignal, createEffect } from "solid-js";
import Song from "./Song";

function WebPlayback({ gameInfo, isHost }) {
  const [playerObj, setPlayerObj] = createSignal(null);
  const [device, setDevice] = createSignal(null);
  const [paused, setPaused] = createSignal(!isHost);
  const [active, setActive] = createSignal(false);
  const [ready, setReady] = createSignal(false);
  const [track, setTrack] = createSignal(null);
  const [songPlayed, setSongPlayed] = createSignal('');

  onMount(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(localStorage.getItem("access_token"));
        },
        volume: isHost ? 0.5 : 0
      });

      setPlayerObj(player);

      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("playback_error", ({ message }) => {
        console.error(message);
      });

      // Playback status updates
      player.addListener("player_state_changed", (state) => {
        if (!state) {
          console.log("no state");
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
      });

      player.play = async ({
        spotify_uri,
        playerInstance: {
          _options: { getOAuthToken, id },
        },
        device_id,
      }) => {
        getOAuthToken((access_token) => {
          fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
            {
              method: "PUT",
              body: JSON.stringify({ uris: [spotify_uri] }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
        });
        setActive(true);
        setReady(true);
      };

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);

        setDevice(device_id);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      // Connect to the player!
      player.connect().then((success) => {
        console.log(success);
        if (success) {
          console.log(
            "The Web Playback SDK successfully connected to Spotify!"
          );
          player.activateElement();
        }
      });
    };

    // Dynamically load the Spotify Web Playback SDK script
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
  });

  createEffect(async () => {
    if (device() && gameInfo().currentsong && songPlayed() !== gameInfo().currentsong) {
      console.log(device());
      await playerObj().play({
        playerInstance: playerObj(),
        spotify_uri: `spotify:track:${gameInfo().currentsong}`,
        device_id: device(),
      });
      setSongPlayed(gameInfo().currentsong)
    }
  });

  console.log(track());

  return (
    <>
      <div>
        <div class="mx-auto flex">
          {track() ? (
            <div class="text-center mx-auto mb-4">
              <img
                src={track().album.images[0].url}
                class="now-playing__cover rounded-lg"
                width="100rem"
                alt=""
              />

              <div className="now-playing__side">
                <div class="now-playing__name font-light text-xl mt-2">{track().name}</div>

                <div class="now-playing__artist">{track().artists[0].name}</div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="w-full font-light flex justify-center pt-0 mt-0 mb-5">
        <button
          onClick={() => {
            if (paused()) {
              playerObj().setVolume(.5);
            } else {
              playerObj().setVolume(0);
            }
            setPaused(!paused());
          }}
          className="text-center mx-auto"
        >
          {paused() ? "Play" : "Pause"}
        </button>
      </div>
    </>
  );

  // Rest of your component code...
}

export default WebPlayback;
