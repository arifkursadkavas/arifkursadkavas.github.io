import { useEffect, useRef } from "react";

export default ({ children }) => {
  const handleFrameLoad = () => {
    var constraints = { audio: true } // add video constraints if required
    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        var audioContext = new AudioContext();
        audioContext.resume()
        console.log(stream.getAudioTracks())
        // ... rest of code
    })
  };

  return (
    <div className="mLayout">
      {children}
      <iframe
        onLoad={handleFrameLoad}
        className={"player"}
        src="https://open.spotify.com/embed/playlist/73woBJMVBdfpdAkcCL2mnU?utm_source=generator"
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};
