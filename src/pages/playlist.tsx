import { useState } from "react";

const Playlist = ({ data }) => {
  const [songList, setSongList] = useState<Song[]>(data);

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

export async function getServerSideProps() {
  const res = await fetch("https://marqop.com:444?offset=0&count=50");
  const data = await res.json();
  return { props: { data } };
}

interface Song {
  id: string;
  artist: string;
  song: string;
  created_on: string;
}
