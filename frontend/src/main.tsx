import '@fontsource/nokora/400.css'
import '@fontsource/nokora/700.css'

import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import App from './App'

import theme from './theme'


const rootElement = document.getElementById('root')
if (rootElement) {

  ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      {/* <ColorModeProvider> <App /> </ColorModeProvider> */}
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)

}