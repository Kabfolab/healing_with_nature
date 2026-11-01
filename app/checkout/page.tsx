"use client"
import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'

export default function Checkout(){
  const {cart,total,clearCart} = useCart()
  const [ready,setReady]=useState(false)
  useEffect(()=>{
    if((window as any).PaystackPop){ setReady(true); return }
    const s=document.createElement('script')
    s.src='https://js.paystack.co/v1/inline.js'
    s.onload=()=>setReady(true)
    document.body.appendChild(s)
  },[])

  const pay = (e:any)=>{
    e.preventDefault()
    const KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    const fd=new FormData(e.target)
    // @ts-ignore
    const h=(window as any).PaystackPop.setup({
      key: KEY,
      email: String(fd.get('email')),
      amount: Math.round(Number(total)*100),
      currency: 'NGN',
      ref: 'HWNT-'+Date.now(),
      onClose: ()=>{},
      callback: (r:any)=>{
        alert('PAYMENT SUCCESS! Ref: '+r.reference+'\nWe will contact you.')
        clearCart()
        window.location.href='/shop'
      }
    })
    h.openIframe()
  }

  return(
    <div className="min-h-screen bg-[#f8fdf8] p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-[24px] shadow mt-10">
        <h1 className="text-3xl font-black">Checkout ✓ ₦{Number(total).toLocaleString()}</h1>
        <form onSubmit={pay} className="mt-6 space-y-3">
          <input name="name" defaultValue="Idrees" required className="w-full p-4 bg-gray-50 border rounded-2xl"/>
          <input name="email" defaultValue="kabfolab@gmail.com" required className="w-full p-4 bg-gray-50 border rounded-2xl"/>
          <input name="phone" required placeholder="Phone" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
          <textarea name="address" required placeholder="Address" className="w-full p-4 bg-gray-50 border rounded-2xl h-24"/>
          <button className="w-full bg-[#0f4c1f] text-white py-4 rounded-full font-black">Pay Now</button>
        </form>
      </div>
    </div>
  )
}
