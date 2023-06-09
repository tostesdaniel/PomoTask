import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInSeconds } from "date-fns";
import { Play, Stop } from "phosphor-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  StartCountdownButton,
  TaskInput,
} from "./styles";

const newCycleFormValidationSchema = z.object({
  task: z.string().nonempty(),
  minutesAmount: z.number().min(5).max(60),
});

type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
}

export default function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [secondsPassed, setSecondsPassed] = useState(0);

  const { handleSubmit, register, reset, watch } = useForm<NewCycleFormData>({
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
    resolver: zodResolver(newCycleFormValidationSchema),
  });
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

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
  }, [activeCycle]);

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((prevCycles) => [...prevCycles, newCycle]);
    setActiveCycleId(id);
    setSecondsPassed(0);

    reset();
  }

  const totalSecondsInCycle = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const elapsedSecondsInCycle = totalSecondsInCycle - secondsPassed;

  const elapsedMinutes = Math.floor(elapsedSecondsInCycle / 60);
  const elapsedSeconds = elapsedSecondsInCycle % 60;

  const formattedElapsedMinutes = String(elapsedMinutes).padStart(2, "0");
  const formattedElapsedSeconds = String(elapsedSeconds).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${formattedElapsedMinutes}:${formattedElapsedSeconds} | PomoTask`;
    }
  }, [activeCycle, formattedElapsedMinutes, formattedElapsedSeconds]);

  const task = watch("task");
  const isSubmitDisabled = !task;

  useEffect(() => {
    if (elapsedSecondsInCycle <= 0 && activeCycle) {
      setActiveCycleId(null);
      setSecondsPassed(0);
    }
  }, [elapsedSecondsInCycle, activeCycle]);

  function renderButton() {
    if (activeCycle) {
      return (
        <StartCountdownButton type="button" $variant="stop">
          <Stop size={24} />
          Parar
        </StartCountdownButton>
      );
    }

    return (
      <StartCountdownButton
        type="submit"
        disabled={isSubmitDisabled}
        $variant="start"
      >
        <Play size={24} />
        Começar
      </StartCountdownButton>
    );
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            disabled={!!activeCycle}
            {...register("task")}
          />

          <datalist id="task-suggestions">
            <option value="Estudar Biologia" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="text"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minutos</span>
        </FormContainer>

        <CountdownContainer>
          <span>{formattedElapsedMinutes[0]}</span>
          <span>{formattedElapsedMinutes[1]}</span>
          <span>:</span>
          <span>{formattedElapsedSeconds[0]}</span>
          <span>{formattedElapsedSeconds[1]}</span>
        </CountdownContainer>

        {renderButton()}
      </form>
    </HomeContainer>
  );
}
