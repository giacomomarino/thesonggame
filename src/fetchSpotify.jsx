
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
    const data = await response.json();
    console.log(data)
    return data
  }
  catch (err) {
    console.log(err)
    return err
  }
}



export async function checkAuth() {
  if (localStorage.getItem('access_token')) {
    try {
      response = await fetch(`${BASEURL}${endpoint}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        method
      })
      if (response.status === 200) {
        return true
      } else return false

    } catch (error) {
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