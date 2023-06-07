import { Play } from "phosphor-react";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  StartCountdownButton,
  TaskInput,
} from "./styles";

export default function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
          />

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput type="text" id="minutesAmount" placeholder="00" />

          <span>minutos</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <span>:</span>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
