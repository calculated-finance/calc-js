import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './components/providers/theme-provider.tsx'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoMapProvider } from './components/providers/memo-map-provider.tsx'
import { WalletProvider } from './components/providers/wallet-provider.tsx'
import { routeTree } from './routeTree.gen.ts'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <MemoMapProvider>
      <ThemeProvider>
        <WalletProvider>
          <RouterProvider router={router} />
        </WalletProvider>
      </ThemeProvider>
    </MemoMapProvider>
    </QueryClientProvider>
  </StrictMode>
)
