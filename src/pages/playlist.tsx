import { useEffect, useState } from "react";

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
      <table>
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
      </table>
  );
};
export default Playlist;


interface Song {
  id: string;
  artist: string;
  song: string;
  created_on: string;
}
