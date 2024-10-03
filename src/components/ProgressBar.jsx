import { useEffect, useState } from "react";

const TIMER = 3000;

export default function ProgressBar({ timer }) {
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const progress = setInterval(() => {
      console.log("INTERVAL");
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);

    return () => {
      clearInterval(progress);
    };
  }, []);

  return <progress value={remainingTime} max={timer} />;
}
