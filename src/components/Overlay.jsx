import { useProgress } from "@react-three/drei";
import { usePlay } from "../context/Play";

export const Overlay = () => {
  const { progress } = useProgress();

  const { play, setPlay, end, hasScroll } = usePlay();

  return (
    <div
      className={`overlay ${play ? "overlay--fade" : ""} 
    ${hasScroll ? "overlay--scroll" : ""}
    `}
    >
      <div className={`loader ${progress === 100 ? "loader--fade" : ""}`} />
      {progress === 100 && (
        <div className={`intro ${play ? "intro--fade" : ""}`}>
          <h1 className="logo">Wonder Air</h1>
          <p className="intro__scroll">scroll to come aboard</p>
          <button
            className="explore"
            onClick={() => {
              setPlay(true);
            }}
          >
            Explore
          </button>
        </div>
      )}
      <div className={`outro ${end ? "outro--appear" : ""}`}>
        <p className="outro__text">
          Thank you for flying with us! <br /> Hope that you enjoyed your flight
        </p>
      </div>
    </div>
  );
};
