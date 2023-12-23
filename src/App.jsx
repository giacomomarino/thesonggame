import { createEffect, createSignal } from 'solid-js'
import './App.css'
import { checkAuth } from './fetchSpotify';
import { Navigate } from "@solidjs/router";


async function authenticate() {
  const clientId = import.meta.env.VITE_CLIENT_ID || ''
  const redirectUri =  `${window.location.href}callback`;

  const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private app-remote-control user-top-read user-read-recently-played';
  const authUrl = new URL("https://accounts.spotify.com/authorize")

  const codeVerifier = generateRandomString(64);

  window.localStorage.setItem('code_verifier', codeVerifier);

  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);

  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
  
}


const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}



function App() {

 
  const [authenticated, setAuthenticated] = createSignal(false)

  checkAuth().then((res) => {
    setAuthenticated(res)
  })

  createEffect(() => {
    //if (authenticated()) return <Navigate href='/user'></Navigate>
  })

  return (
    <div className='flex-col'>
      <div className='justify-center text-center mb-5'>
          <img className="rounded-xl border border-slate-400 mx-auto" src={'images/thesonggamelogo.png'} width="200vh" class="logo" alt="logo" />
      </div>
      <h1>The Song Game</h1>
      <div class="card">
        <button className="m-2" onClick={(evt) => {
          evt.preventDefault()
          authenticate()
        }}>
          Login
        </button>
        
      </div>
      <p class="read-the-docs">
        Start by logging in using your Spotify Account
      </p>
    </div>
  )
}

export default App
