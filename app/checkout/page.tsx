"use client"
import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Checkout(){
  const {cart,total} = useCart()
  const [loading,setLoading]=useState(false)
  const [paystackReady,setPaystackReady]=useState(false)

  useEffect(()=>{
    if(typeof window !== 'undefined' && (window as any).PaystackPop){
      setPaystackReady(true)
      return
    }
    const s = document.createElement('script')
    s.src = 'https://js.paystack.co/v1/inline.js'
    s.async = true
    s.onload = () => setPaystackReady(true)
    document.body.appendChild(s)
  },[])

  const handlePay = async (e:any)=>{
    e.preventDefault()
    if(cart.length===0) return alert("Cart empty")
    if(!total || Number(total)===0) return alert("Total is 0, add items")

    const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC
    if(!PAYSTACK_KEY) return alert("Paystack public key missing on Vercel")

    setLoading(true)
    try{
      const formData = new FormData(e.target)
      const customer = {
        customer_name: String(formData.get('name')),
        customer_email: String(formData.get('email')),
        customer_phone: String(formData.get('phone')),
        shipping_address: String(formData.get('address')),
      }
      const email = customer.customer_email
      const amount = Math.round(Number(total)*100)

      // @ts-ignore - CORRECT Paystack method for inline.js v1
      const handler = (window as any).PaystackPop.setup({
        key: PAYSTACK_KEY,
        email: email,
        amount: amount,
        currency: 'NGN',
        ref: ''+Date.now()+Math.floor(Math.random()*1000),
        onClose: ()=>{
          setLoading(false)
        },
        callback: async (res:any)=>{
          try{
            const verifyRes = await fetch('/api/verify-paystack',{
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body: JSON.stringify({reference: res.reference})
            })
            const verifyData = await verifyRes.json()
            if(verifyData.status !== true && verifyData.data?.status !== 'success'){
              alert("Paid but verification failed, keep ref: "+res.reference)
              setLoading(false)
              return
            }
            const {data:{user}} = await supabase.auth.getUser()
            await supabase.from('orders').insert({
              user_id: user?.id || null,
              ...customer,
              total: Number(total),
              items: cart,
              paystack_ref: res.reference,
              status:'paid'
            })
            alert('Paid! '+res.reference)
            window.location.href='/shop'
          }catch(err){
            console.error(err)
            alert('Paid but saving failed, ref: '+res.reference)
            setLoading(false)
          }
        }
      })
      handler.openIframe()
      }catch(err:any){
        console.error(err)
        alert("Paystack error: " + (err?.message || JSON.stringify(err)))
        setLoading(false)
     }

  return (
    <div className="min-h-screen bg-[#f8fdf8] p-4 md:p-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <form onSubmit={handlePay} className="bg-white p-6 md:p-8 rounded-[28px]">
          <Link href="/cart" className="text-sm font-bold text-gray-400">← Back to Cart</Link>
          <h2 className="text-3xl font-black mt-4">Checkout {paystackReady ? '✓' : ''}</h2>
          <div className="space-y-4 mt-6">
            <input name="name" required placeholder="Full Name" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
            <input name="email" type="email" required placeholder="Email" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
            <input name="phone" required placeholder="Phone" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
            <textarea name="address" required placeholder="Address" className="w-full p-4 bg-gray-50 border rounded-2xl h-24"/>
            <button type="submit" disabled={loading} className="w-full bg-[#0f4c1f] text-white py-4 rounded-full font-black disabled:opacity-60">
              {loading ? 'Processing...' : 'Pay ₦'+Number(total).toLocaleString()}
            </button>
            {total===0 && <p className="text-red-500 text-xs text-center">Cart empty, add product first</p>}
          </div>
        </form>
        <div className="bg-[#0f4c1f] text-white p-8 rounded-[28px] h-fit">Total ₦{Number(total).toLocaleString()}</div>
      </div>
    </div>
  )
}
