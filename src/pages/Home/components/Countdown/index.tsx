import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";
import { CyclesContext } from "../../../../contexts/CycleContext";
import { CountdownContainer } from "./styles";

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    secondsPassed,
    setSecondsPassed,
    finishCycle,
  } = useContext(CyclesContext);

  const totalSecondsInCycle = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const currentDate = new Date();
        const difference = differenceInSeconds(
          currentDate,
          activeCycle.startDate
        );
        setSecondsPassed(difference);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeCycle, setSecondsPassed]);

  const elapsedSecondsInCycle = totalSecondsInCycle - secondsPassed;

  const elapsedMinutes = Math.floor(elapsedSecondsInCycle / 60);
  const elapsedSeconds = elapsedSecondsInCycle % 60;

  const formattedElapsedMinutes = String(elapsedMinutes).padStart(2, "0");
  const formattedElapsedSeconds = String(elapsedSeconds).padStart(2, "0");

  useEffect(() => {
    if (activeCycle && elapsedSecondsInCycle <= 0) {
      finishCycle();
      setSecondsPassed(0);
    }
  }, [
    activeCycle,
    activeCycleId,
    elapsedSecondsInCycle,
    finishCycle,
    setSecondsPassed,
  ]);

  useEffect(() => {
    if (elapsedSecondsInCycle <= 0 && activeCycle) {
      setSecondsPassed(0);
    }
  }, [elapsedSecondsInCycle, activeCycle, setSecondsPassed]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${formattedElapsedMinutes}:${formattedElapsedSeconds} | PomoTask`;
    }
  }, [activeCycle, formattedElapsedMinutes, formattedElapsedSeconds]);

  return (
    <CountdownContainer>
      <span>{formattedElapsedMinutes[0]}</span>
      <span>{formattedElapsedMinutes[1]}</span>
      <span>:</span>
      <span>{formattedElapsedSeconds[0]}</span>
      <span>{formattedElapsedSeconds[1]}</span>
    </CountdownContainer>
  );
}
