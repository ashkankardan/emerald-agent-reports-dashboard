import { useState, useEffect } from "react";

const useCalcBarLength = ({ current, goal }) => {
  const [length, setLength] = useState(0);

  useEffect(() => {
    const lenPerc = (Number(current) * 100) / Number(goal);
    const roundedLenPerc = parseFloat(lenPerc.toFixed(2));
    setLength(roundedLenPerc);
  }, [current, goal]);

  return length;
};

export default useCalcBarLength;
