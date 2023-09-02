import axios from "axios"
import { useEffect, useState } from "react"

const Playlist = ()=>{

    const [songList, setSongList] = useState<Song[]>([])

    useEffect(()=>{
        axios.get('https://marqop.com:444?offset=0&count=50').then((response)=>{
            setSongList(response.data)
        }).catch((e)=>{
            console.log(e)
        })
    },[])

    const formatTime = (time:string) =>{
       return  new Date(time).toLocaleString().toString()
    }

    return (
      <>
        <div className="eksenList">
          <span>Radio Eksen Sarki Listesi</span> 
          {songList &&
            songList.map((song) => {
              return (
                <li>
                  <span>{song.song}</span>  <span>{song.artist}</span> {" "}
                  <span>{formatTime(song.created_on)}</span>
                </li>
              );
            })}
        </div>
      </>
    );
}
export default Playlist

interface Song{
    id:string,
    artist:string
    song:string
    created_on:string
}