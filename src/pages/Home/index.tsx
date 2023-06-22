import { zodResolver } from "@hookform/resolvers/zod";
import { Play, Stop } from "phosphor-react";
import { createContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleForm";
import { HomeContainer, StartCountdownButton } from "./styles";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CycleContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  setActiveCycleId: React.Dispatch<React.SetStateAction<string | null>>;
  setCycles: React.Dispatch<React.SetStateAction<Cycle[]>>;
  secondsPassed: number;
  setSecondsPassed: React.Dispatch<React.SetStateAction<number>>;
}

export const CyclesContext = createContext({} as CycleContextType);

const newCycleFormValidationSchema = z.object({
  task: z.string().nonempty(),
  minutesAmount: z.number().min(1).max(60),
});

type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>;

export default function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [secondsPassed, setSecondsPassed] = useState(0);

  const newCycleForm = useForm<NewCycleFormData>({
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
    resolver: zodResolver(newCycleFormValidationSchema),
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

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

  function handleInterrupCycle() {
    if (activeCycle) {
      const interruptedCycle = {
        ...activeCycle,
        interruptedDate: new Date(),
      };

      setCycles((prevCycles) => {
        const updatedCycles = prevCycles.map((cycle) => {
          if (cycle.id === activeCycleId) {
            return interruptedCycle;
          } else {
            return cycle;
          }
        });

        return updatedCycles;
      });

      setActiveCycleId(null);
      setSecondsPassed(0);
    }
  }

  const task = watch("task");
  const isSubmitDisabled = !task;

  function renderButton() {
    if (activeCycle) {
      return (
        <StartCountdownButton
          type="button"
          $variant="stop"
          onClick={handleInterrupCycle}
        >
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
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            setActiveCycleId,
            setCycles,
            secondsPassed,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>
        {renderButton()}
      </form>
    </HomeContainer>
  );
}
