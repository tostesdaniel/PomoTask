import { zodResolver } from "@hookform/resolvers/zod";
import { Play, Stop } from "phosphor-react";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { CyclesContext } from "../../contexts/CycleContext";
import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleForm";
import { HomeContainer, StartCountdownButton } from "./styles";

const newCycleFormValidationSchema = z.object({
  task: z.string().nonempty(),
  minutesAmount: z.number().min(1).max(60),
});

type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>;

export default function Home() {
  const { activeCycle, createNewCycle, interruptCycle } =
    useContext(CyclesContext);

  const newCycleForm = useForm<NewCycleFormData>({
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
    resolver: zodResolver(newCycleFormValidationSchema),
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const handleCreateNewCycle = (data: NewCycleFormData) => {
    createNewCycle(data);
    reset();
  };

  const task = watch("task");
  const isSubmitDisabled = !task;

  function renderButton() {
    if (activeCycle) {
      return (
        <StartCountdownButton
          type="button"
          $variant="stop"
          onClick={interruptCycle}
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
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />
        {renderButton()}
      </form>
    </HomeContainer>
  );
}
