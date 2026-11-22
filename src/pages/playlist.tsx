import { useEffect, useState } from "react";
import Seo from '../components/Seo';

const Playlist = () => {
  const [songList, setSongList] = useState<Song[]>([]);

  useEffect(()=>{
    fetch("https://marqop.com:444?offset=0&count=50").then(response => response.json()).then(data => {
    setSongList(data)
    })

  },[])

  const formatTime = (time: string) => {
    return new Date(time).toLocaleString().toString();
  };

  return (
    <main>
      <Seo
        title="Recently Played Songs | Arif Kürsad Kavas"
        description="A list of recently played songs, artists, and play times."
        path="/playlist"
      />
      <h1>Recently Played Songs</h1>
      <p>Recent tracks and when they were played.</p>
      <table>
        <caption>Recently played tracks</caption>
        <thead>
          <tr>
            <th scope="col">Song</th>
            <th scope="col">Artist</th>
            <th scope="col">Played</th>
          </tr>
        </thead>
        <tbody>
        {songList &&
          songList.map((song, idx) => {
            return (
              <tr key={idx}>
                <td>{song.song}</td>
                <td>{song.artist}</td>
                <td>{formatTime(song.created_on)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
};
export default Playlist;


interface Song {
  id: string;
  artist: string;
  song: string;
  created_on: string;
}
