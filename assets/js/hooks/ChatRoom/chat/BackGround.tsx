import React, { useEffect, useState } from "react";

export default function BackGround() {
  const [imageNumber, setImageNumber] = useState(1);

  useEffect(() => {
    const randomImageNumber = Math.floor(Math.random() * 5) + 1;
    setImageNumber(randomImageNumber);
  }, []);

  return (
    <div className="flex flex-col flex-grow w-full border-l border-r justify-center items-center">
      <img
        src={`/images/background2/background-${imageNumber}.svg`} 
        alt="background"
        className="object-cover w-full h-full "
      />
    </div>
  );
}
