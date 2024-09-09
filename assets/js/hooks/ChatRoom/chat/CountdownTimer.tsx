import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import {
  CaretRightOutlined,
  PauseOutlined,
  UndoOutlined,
} from "@ant-design/icons";

export default function CountdownTimer() {
  const seconds = 25 * 60;
  const [time, setTime] = useState(seconds); // tiempo en segundos
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTime(60); // Restablece el tiempo a 1 minuto
    setIsRunning(false);
  };

  // Formatear el tiempo (minutos y segundos)
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Limpieza del temporizador cuando el componente se desmonte
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="flex flex-col w-[20vw] mt-4 items-center justify-center rounded-lg space-y-4">
      {/* Pantalla del temporizador */}
      <div className="text-5xl font-mono">{formatTime()}</div>
      {/* Botones */}
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
