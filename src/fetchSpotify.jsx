
const BASEURL = 'https://api.spotify.com/'

export async function fetchWebApi(endpoint, method, body) {
  let accessToken = localStorage.getItem('access_token');
  var response;
  try {

    response = await fetch(`${BASEURL}${endpoint}`, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      method,
      body: JSON.stringify(body)
    })
    if (response.message === 'The access token expired') {
      console.log(response)
      await getRefreshToken();
      //return await fetchWebApi(endpoint, method, body);
    }
    const data = await response.json();
    return data
  }
  catch (error) {
    console.log(error)
    return error
  }
}



export async function checkAuth() {
  let response;
  if (localStorage.getItem('access_token')) {
    try {
      response = await fetch(`${BASEURL}v1/me`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token')
        },
        method: 'GET'
      })
      if (response.message === 'The access token expired') {
        await getRefreshToken();
        
      }


      if (response.status === 200) {
        return true
      } else return false

    } catch (error) {
      console.log(error)
      return false
    }
  }
  return false
}

const topTracksIds = [
  '6LrrBIXJYJwbtnOLqPizcU', '3R7H8PBdTsib9RRcS4gSgI', '1VLtjHwRWOVJiE5Py7JxoQ', '7CNRVEMSXo0fRJwZyM0L2n', '7xfueRdAGnr8pKEIhkGcc8'
];

async function getRecommendations() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  return (await fetchWebApi(
    `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
  )).tracks;
}


async function createPlaylist(tracksUri) {
  const { id: user_id } = await fetchWebApi('v1/me', 'GET')

  const playlist = await fetchWebApi(
    `v1/users/${user_id}/playlists`, 'POST', {
    "name": "My recommendation playlist",
    "description": "Playlist created by the tutorial on developer.spotify.com",
    "public": false
  })

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
    'POST'
  );

  return playlist;
}

const getRefreshToken = async () => {

   // refresh token that has been previously stored
   const refreshToken = localStorage.getItem('refresh_token');
   const url = "https://accounts.spotify.com/api/token";
   const clientId = import.meta.env.VITE_CLIENT_ID || ''

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId
      }),
    }
    const body = await fetch(url, payload);
    const response = await body.json();

    if (response.accessToken) localStorage.setItem('access_token', response.accessToken);
    if (response.refreshToken) localStorage.setItem('refresh_token', response.refreshToken);
  }