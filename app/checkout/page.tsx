"use client"
import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Script from 'next/script'

export default function Checkout(){
  const {cart,total} = useCart()
  const [loading,setLoading]=useState(false)
  const [paystackReady,setPaystackReady]=useState(false)

  // Fix for Vercel hydration - wait for Paystack script
  useEffect(()=>{
    const check = setInterval(()=>{
      // @ts-ignore
      if(window.PaystackPop) { setPaystackReady(true); clearInterval(check) }
    }, 500)
    return ()=> clearInterval(check)
  },[])

  const handlePay = async (e:any)=>{
    e.preventDefault()
    if(cart.length===0) return alert("Cart empty")
    
    // @ts-ignore
    if(!window.PaystackPop) return alert("Paystack still loading, wait 2 sec and try again")
    
    const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC || process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    if(!PAYSTACK_KEY) return alert("Paystack key missing on Vercel - check Vercel env vars")

    const amountInKobo = Math.round(Number(total)*100)
    if(amountInKobo < 100) return alert("Amount too small: ₦"+total)

    setLoading(true)
    const formData = new FormData(e.target)
    const customer = {
      customer_name: String(formData.get('name')),
      customer_email: String(formData.get('email')),
      customer_phone: String(formData.get('phone')),
      shipping_address: String(formData.get('address')),
    }

    // @ts-ignore
    window.PaystackPop.newTransaction({
      key: PAYSTACK_KEY,
      email: customer.customer_email,
      amount: amountInKobo,
      currency: 'NGN',
      ref: `${Date.now()}-${Math.floor(Math.random()*1000)}`,
      onSuccess: async (res:any)=>{
        try{
          // VERIFY on server - important for Vercel
          const verifyRes = await fetch('/api/verify-paystack',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({reference: res.reference})
          })
          const verifyData = await verifyRes.json()
          if(verifyData.status !== true && verifyData.data?.status !== 'success'){
            alert("Payment verification failed, contact support: "+res.reference)
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
          await fetch('/api/send-order-email',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...customer,total,items:cart,ref:res.reference})})
          alert('Paid! '+res.reference)
          window.location.href='/shop'
        }catch(err){
          console.error(err)
          alert('Paid but saving failed, keep ref: '+res.reference)
          setLoading(false)
        }
      },
      onCancel: ()=> setLoading(false)
    })
  }

  return (
    <>
    <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" onLoad={()=>setPaystackReady(true)} />
    <div className="min-h-screen bg-[#f8fdf8] p-4 md:p-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <form onSubmit={handlePay} className="bg-white p-6 md:p-8 rounded-[28px]">
          <Link href="/cart" className="text-sm font-bold text-gray-400">← Back to Cart</Link>
          <h2 className="text-3xl font-black mt-4">Checkout {paystackReady ? '' : '(loading paystack...)'}</h2>
          <div className="space-y-4 mt-6">
            <input name="name" required placeholder="Full Name" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
            <input name="email" type="email" required placeholder="Email" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
            <input name="phone" required placeholder="Phone" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
            <textarea name="address" required placeholder="Address" className="w-full p-4 bg-gray-50 border rounded-2xl h-24"/>
            <button disabled={loading || !paystackReady} className="w-full bg-[#0f4c1f] text-white py-4 rounded-full font-black disabled:opacity-50">
              {loading?'Opening Paystack...': 'Pay ₦'+Number(total).toLocaleString()}
            </button>
            {total===0 && <p className="text-red-500 text-xs text-center">Cart is empty - go back to shop</p>}
          </div>
        </form>
        <div className="bg-[#0f4c1f] text-white p-8 rounded-[28px] h-fit">Total ₦{Number(total).toLocaleString()}</div>
      </div>
    </div>
    </>
  )
}
