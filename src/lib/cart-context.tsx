import { createContext, useContext } from 'react'

export const CartContext = createContext<Record<string, unknown>>({})
export const CartProvider = ({ children }: { children: React.ReactNode }) => (
  <CartContext.Provider value={{}}>{children}</CartContext.Provider>
)
export const useCart = () => useContext(CartContext)
