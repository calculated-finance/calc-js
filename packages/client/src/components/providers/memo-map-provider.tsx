import { Effect, Layer } from 'effect'
import React from 'react'

type MemoMapProviderProps = {
  children: React.ReactNode
}

type MemoMapProviderState = {
  memoMap: Layer.MemoMap
}

const initialState: MemoMapProviderState = {
  memoMap: Effect.runSync(Layer.makeMemoMap),
}

export const MemoMapProviderContext =
  React.createContext<MemoMapProviderState>(initialState)

export const MemoMapProvider = ({ children }: MemoMapProviderProps) => {
  return (
    <MemoMapProviderContext.Provider value={initialState}>
      {children}
    </MemoMapProviderContext.Provider>
  )
}
