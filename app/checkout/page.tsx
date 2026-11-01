"use client"
import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Checkout(){
  const {cart,total,clearCart} = useCart()
  const [loading,setLoading]=useState(false)
  const [ready,setReady]=useState(false)

  useEffect(()=>{
    if((window as any).PaystackPop){ setReady(true); return }
    const s=document.createElement('script')
    s.src='https://js.paystack.co/v1/inline.js'
    s.onload=()=>setReady(true)
    document.body.appendChild(s)
  },[])

  const pay = async (e:any)=>{
    e.preventDefault()
    const KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    if(!KEY) return alert("Missing Public Key")
    setLoading(true)
    const fd=new FormData(e.target)
    const email=String(fd.get('email'))
    const name=String(fd.get('name'))

    // @ts-ignore
    const handler=(window as any).PaystackPop.setup({
      key: KEY,
      email,
      amount: Math.round(Number(total)*100),
      currency: 'NGN',
      ref: 'HWNT-'+Date.now(),
      onClose: ()=>setLoading(false),
      callback: async (r:any)=>{
        try{
          const {data:{user}} = await supabase.auth.getUser()
          const {error} = await supabase.from('orders').insert({
            user_id:user?.id||null,
            customer_name:name,
            customer_email:email,
            customer_phone:String(fd.get('phone')),
            shipping_address:String(fd.get('address')),
            total:Number(total),
            items:cart,
            paystack_ref:r.reference,
            status:'paid'
          })
          if(error) throw error
          alert('Payment Successful! '+r.reference)
          clearCart()
          window.location.href='/shop'
        }catch(err:any){
          alert('Paid but save failed: '+err.message+' Ref: '+r.reference)
          setLoading(false)
        }
      }
    })
    handler.openIframe()
  }

  return(
    <div className="min-h-screen bg-[#f8fdf8] p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-[24px] shadow mt-10">
        <Link href="/cart" className="text-sm text-gray-400 font-bold">← Back</Link>
        <h1 className="text-3xl font-black mt-2">Checkout ✓ ₦{Number(total).toLocaleString()}</h1>
        <form onSubmit={pay} className="mt-6 space-y-3">
          <input name="name" required placeholder="Full Name" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
          <input name="email" type="email" required placeholder="Email" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
          <input name="phone" required placeholder="Phone" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
          <textarea name="address" required placeholder="Delivery Address" className="w-full p-4 bg-gray-50 border rounded-2xl h-24"/>
          <button disabled={loading||!ready} className="w-full bg-[#0f4c1f] text-white py-4 rounded-full font-black">
            {loading?'Processing...':'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  )
}
