import { useNavigate } from "@solidjs/router";

function Callback() {
  const navigate = useNavigate()

  async function getToken() {
    const args = new URLSearchParams(window.location.search);
    const code = args.get('code');
    if (!code) {
      return;
    }
    // stored in the previous step
    let codeVerifier = localStorage.getItem('code_verifier');
    const clientId = import.meta.env.VITE_CLIENT_ID || ''
    const authUrl = new URL("https://accounts.spotify.com/api/token")

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${window.location.href.split('callback')[0]}callback`,
        code_verifier: codeVerifier,
      }),
    }

    const body = await fetch(authUrl, payload).catch((err) => {
      console.log(err)
      return;
    });

    if (body.status != 200) return;
    const response = await body.json();
    console.log('Access Token:', response.access_token)
    console.log('Refresh Token:', response.refresh_token)

    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    navigate('/user', { replace: true })
  }

  getToken();

  return (
    <>
      <p>Error recieving Authoriziation token...</p>
      <button  onClick={navigate("/")}>Return to home page</button>
    </>
  )
}



export default Callback