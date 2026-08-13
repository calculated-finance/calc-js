import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './components/providers/theme-provider.tsx'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RuntimeProvider } from './components/providers/runtime-provider.tsx'
import { WalletProvider } from './components/providers/wallet-provider.tsx'
import { routeTree } from './routeTree.gen.ts'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient();

// Dev console access for poking caches (e.g. simulating balance changes).
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__queryClient = queryClient;
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <RuntimeProvider>
      <ThemeProvider defaultTheme="dark">
        <WalletProvider>
          <RouterProvider router={router} />
        </WalletProvider>
      </ThemeProvider>
    </RuntimeProvider>
    </QueryClientProvider>
  </StrictMode>
)
