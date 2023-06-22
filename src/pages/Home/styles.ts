import { styled } from "styled-components";

export const HomeContainer = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3.5rem;
  }
`;

type ButtonVariant = "start" | "stop";

interface ButtonProps {
  $variant: ButtonVariant;
}

export const StartCountdownButton = styled.button<ButtonProps>`
  width: 100%;
  border: 0;
  border-radius: 8px;
  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  font-weight: bold;

  cursor: pointer;

  background: ${(props) =>
    props.$variant === "start" ? props.theme["green-500"] : props.theme.accent};
  color: ${(props) => props.theme["gray-100"]};

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: ${(props) =>
      props.$variant === "start"
        ? `${props.theme["green-700"]}`
        : props.theme.accent};
    ${(props) => props.$variant === "stop" && `filter: brightness(0.7);`}
  }
`;
