import { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import TrackSearchResult from "./TrackSearchResult";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import Player from "./Player";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "9244ea1428b34f85bc412f784f088d63",
});

const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  const chooseTrack = (track) => {
    setPlayingTrack(track);
    setSearch('');
    setLyrics('');
  }

  console.log('searchResults', searchResults);
  useEffect(() => {
    if (!playingTrack) return;

    axios.get("http://localhost:3001/lyrics", {
      params: {
        track: playingTrack.title,
        artist: playingTrack.artist 
      }
    }).then(res => {
      setLyrics(res.data.lyrics);
    });
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;

      const currentSearchResults = res.body.tracks.items.map(({ artists, name, uri, album}) => ({
        artist: artists[0].name,
        title: name,
        uri: uri,
        albumUrl: album.images.reduce((smallest, image) => image.height < smallest.height ? image : smallest, album.images[0]).url
      }));
      console.log('currentSearchResults', currentSearchResults);
      setSearchResults(currentSearchResults);
    });
    return () => cancel = true;
  }, [search, accessToken]);

  return (
    <Container className="dashboard">
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="dashboard__songs">
        {searchResults.map(track => <TrackSearchResult key={track.uri} track={track} chooseTrack={chooseTrack} />)}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
};

export default Dashboard;
