import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
  html, body, #__next {
    height: 100%;
  }
  html{
    font-size: 62.5%; //REM
  }
  body {
    font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
    color: #FFFFFF;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  :root{
    --color-primary: #6874E8;
    --background: #25283D;
    --white: #FFFFFF;
    --black: #000000;
  }

`

export default GlobalStyles
