import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MarketProvider } from './context/MarketProvider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools} from '@tanstack/react-query-devtools'

const queryClient= new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MarketProvider>
      <QueryClientProvider client={queryClient} >
        <App />
        <ReactQueryDevtools/>
      </QueryClientProvider>
    </MarketProvider>
  </React.StrictMode>,
)
