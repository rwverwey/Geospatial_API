import { createGlobalStyle } from 'styled-components';
import { colors } from './theme';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', 'Inter', sans-serif;
    background-color: ${colors.background};
    color: ${colors.textPrimary};
    line-height: 1.6;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${colors.border};
    border-radius: 6px;
  }

  button {
    font-family: inherit;
  }

  input, button {
    outline: none;
  }
`;
