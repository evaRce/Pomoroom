import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import {
  CaretRightOutlined,
  PauseOutlined,
  UndoOutlined,
} from "@ant-design/icons";

export default function CountdownTimer() {
  const workSeconds = 25 * 60;
  const breakSeconds = 5 * 60;
  const [time, setTime] = useState(workSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const timerRef = useRef(null);
  const audioWork = useRef(new Audio("/sounds/bell-notification.wav"));
  const audioRest = useRef(new Audio("/sounds/happy-bells-notification.wav"));

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            setIsFinish(true);
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    if (isFinish) {
      if (isWorkTime) {
        audioRest.current.play();
      } else {
        audioWork.current.play();
      }
      setIsWorkTime((prevIsWorkTime) => !prevIsWorkTime);
      clearInterval(timerRef.current);
      setIsRunning(false);
      setTime(isWorkTime ? breakSeconds : workSeconds);
      setIsFinish(false);
    }
  }, [isFinish, isWorkTime, breakSeconds, workSeconds]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTime(workSeconds);
    setIsRunning(false);
    setIsWorkTime(true);
    setIsFinish(false);
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="flex flex-col w-[20vw] mt-4 items-center justify-center rounded-lg space-y-4">
      <span className="text-xl font-mono"> {isWorkTime ? "Trabajo" : "Descanso"}</span>
      <div className="text-5xl font-mono">{formatTime()}</div>
      <div className="flex space-x-3">
        <Button
          onClick={startTimer}
          disabled={isRunning}
          icon={<CaretRightOutlined />}
          title="Empezar"
        />
        <Button
          onClick={stopTimer}
          disabled={!isRunning}
          icon={<PauseOutlined />}
          title="Parar"
        />
        <Button onClick={resetTimer} icon={<UndoOutlined />} title="Resetear" />
      </div>
    </div>
  );
}
