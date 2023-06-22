import { styled } from "styled-components";

export const CountdownContainer = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 10rem;
  line-height: 8rem;
  color: ${(props) => props.theme["gray-100"]};

  display: flex;
  gap: 1rem;

  span {
    background: ${(props) => props.theme["gray-700"]};
    padding: 2rem 1rem;
    border-radius: 8px;
  }

  span:nth-child(3) {
    background: none;
    padding: 2rem 0;
    color: ${(props) => props.theme.accent};
    width: 4rem;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
`;
