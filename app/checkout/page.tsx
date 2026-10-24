"use client"
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Script from 'next/script'

export default function Checkout(){
  const {cart,total} = useCart()
  const [loading,setLoading]=useState(false)

  const handlePay = async (e:any)=>{
    e.preventDefault()
    if(cart.length===0) return alert("Cart empty")
    
    // @ts-ignore
    if(!window.PaystackPop){
      alert("Paystack still loading. Refresh page and wait 3 seconds.")
      return
    }

    setLoading(true)
    const customer = {
      customer_name: e.target.name.value,
      customer_email: e.target.email.value,
      customer_phone: e.target.phone.value,
      shipping_address: e.target.address.value,
    }

    try{
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: "pk_test_cfb90913888b72d0f5d8d40f6ade5a7b99d98665",
        email: customer.customer_email,
        amount: Math.round(Number(total)*100),
        currency: 'NGN',
        ref: `${Date.now()}`,
        callback: async function(res:any){
          const {data:{user}} = await supabase.auth.getUser()
          await supabase.from('orders').insert({user_id:user?.id, ...customer, total, items:cart, paystack_ref:res.reference, status:'paid'})
          await fetch('/api/send-order-email',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...customer,total,items:cart,ref:res.reference})})
          alert('Paid! Ref: '+res.reference)
          window.location.href='/shop'
        },
        onClose: function(){ setLoading(false) }
      })
      handler.openIframe()
    }catch(err:any){
      alert("Paystack error: "+err.message)
      setLoading(false)
    }
  }

  return (
    <>
    <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
    <div className="min-h-screen bg-[#f8fdf8] p-4 md:p-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <form onSubmit={handlePay} className="bg-white p-6 md:p-8 rounded-[28px] shadow-sm">
          <Link href="/cart" className="text-sm font-bold text-gray-400">← Back to Cart</Link>
          <h2 className="text-3xl font-black mt-4">Checkout</h2>
          <div className="space-y-4 mt-6">
            <input name="name" required placeholder="Full Name" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
            <input name="email" type="email" required placeholder="Email" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
            <input name="phone" required placeholder="Phone" className="w-full p-4 bg-gray-50 border rounded-2xl"/>
            <textarea name="address" required placeholder="Address" className="w-full p-4 bg-gray-50 border rounded-2xl h-24"/>
            <button disabled={loading} className="w-full bg-[#0f4c1f] text-white py-4 rounded-full font-black">{loading?'Opening Paystack...':'Pay ₦'+total.toLocaleString()}</button>
          </div>
        </form>
        <div className="bg-[#0f4c1f] text-white p-8 rounded-[28px] h-fit">
          <h3 className="font-black">Total ₦{total.toLocaleString()}</h3>
        </div>
      </div>
    </div>
    </>
  )
}
