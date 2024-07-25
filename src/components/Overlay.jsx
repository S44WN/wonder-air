import { useProgress } from "@react-three/drei";

export const Overlay = () => {
  const { progress } = useProgress();

  return (
    <div className="overlay">
      <div className={`loader ${progress === 100 ? "loader--fade" : ""}`} />
      {progress === 100 && (
        <div className="intro">
          <h1 className="logo">Wonder Air</h1>
          <button className="explore">Explore</button>
        </div>
      )}
    </div>
  );
};
