import '@fontsource/nokora/400.css'
import '@fontsource/nokora/700.css'

import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import App from './App'

import theme from './theme'
import { Global } from '@emotion/react'


const rootElement = document.getElementById('root')
if (rootElement) {

  ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Global
        styles={{
          "html, body": {
            overflow: "hidden",
            height: "100%", // opcional pero recomendable
          },
        }}
      />
      {/* <ColorModeProvider> <App /> </ColorModeProvider> */}
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)

}