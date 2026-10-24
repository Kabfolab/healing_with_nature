"use client"
import { createContext, useContext, useState } from 'react';
const CartContext = createContext<any>(null);
export const useCart = () => useContext(CartContext);
export function CartProvider({children}:{children:React.ReactNode}){
  const [cart,setCart]=useState<any[]>([]);
  const addToCart = (p:any) => setCart((prev:any[])=>{
    const f = prev.find(i=>i.id===p.id);
    if(f) return prev.map(i=>i.id===p.id?{...i, qty:i.qty+1}:i);
    return [...prev,{...p, qty:1}];
  });
  const removeFromCart = (id:string)=>setCart((prev:any[])=>prev.filter(i=>i.id!==id));
  const total = cart.reduce((a,c)=>a + c.price * c.qty,0);
  const count = cart.reduce((a,c)=>a + c.qty,0);
  return <CartContext.Provider value={{cart,addToCart,removeFromCart,total,count,setCart}}>{children}</CartContext.Provider>
}
