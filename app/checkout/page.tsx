"use client"
import { useCart } from '@/context/CartContext'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
declare global { interface Window { PaystackPop:any } }

export default function Checkout(){
  const {cart,total} = useCart()
  const [loading,setLoading]=useState(false)

  // Load Paystack once when page opens
  useEffect(()=>{
    if(!document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')){
      const s=document.createElement('script'); 
      s.src='https://js.paystack.co/v1/inline.js'; 
      document.body.appendChild(s)
    }
  },[])

  const handlePay = async (e:any)=>{
    e.preventDefault()
    if(cart.length===0) return alert("Cart empty")
    
    // Check if Paystack script loaded
    if(!window.PaystackPop){
      alert("Paystack is still loading, wait 2 seconds and try again")
      setLoading(false)
      return
    }

    setLoading(true)
    const customer = {
      customer_name: e.target.name.value,
      customer_email: e.target.email.value,
      customer_phone: e.target.phone.value,
      shipping_address: e.target.address.value,
    }

    const handler=window.PaystackPop.setup({
      key: "pk_test_cfb90913888b72d0f5d8d40f6ade5a7b99d98665",
      email: customer.customer_email,
      amount: Math.round(total*100), // must be integer kobo
      currency:'NGN',
      ref: ''+Math.floor((Math.random() * 1000000000) + 1),
      callback: async (res:any)=>{
        try {
          const {data:{user}} = await supabase.auth.getUser()
          await supabase.from('orders').insert({user_id:user?.id, ...customer, total, items:cart, paystack_ref:res.reference, status:'paid'})
          await fetch('/api/send-order-email',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...customer,total,items:cart,ref:res.reference})})
          alert('Paid! We will contact you shortly 🌿')
          window.location.href='/shop'
        } catch(err){
          alert('Payment success but order save failed, contact us with ref: '+res.reference)
          setLoading(false)
        }
      },
      onClose:()=>setLoading(false)
    }); 
    handler.openIframe()
  }

  return (
    <div className="min-h-screen bg-[#f8fdf8] p-4 md:p-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <form onSubmit={handlePay} className="bg-white p-6 md:p-8 rounded-[28px] shadow-sm">
          <Link href="/cart" className="text-sm font-bold text-gray-400">← Back to Cart</Link>
          <h2 className="text-3xl font-black mt-4">Checkout</h2>
          <p className="text-sm text-gray-500 mb-6">We will call you after payment to confirm delivery.</p>
          <div className="space-y-4">
            <input name="name" required placeholder="Full Name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-700"/>
            <input name="email" type="email" required placeholder="Email Address" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2"/>
            <input name="phone" required placeholder="Phone Number (WhatsApp)" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2"/>
            <textarea name="address" required placeholder="Full Delivery Address (House, Street, State)" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 h-24"/>
            <button disabled={loading} className="w-full bg-[#0f4c1f] text-white py-4 rounded-full font-black text-lg shadow-xl disabled:opacity-50">{loading?'Opening Paystack...':'Pay ₦'+total.toLocaleString()+' with Paystack'}</button>
          </div>
        </form>
        <div className="bg-[#0f4c1f] text-white p-8 rounded-[28px] h-fit">
          <h3 className="font-black text-xl">Order Review</h3>
          <div className="mt-6 space-y-3 max-h-64 overflow-auto">
            {cart.map((i:any)=><div key={i.id} className="flex justify-between text-sm text-white/80"><span>{i.name} x {i.qty}</span><span>₦{(i.price*i.qty).toLocaleString()}</span></div>)}
          </div>
          <div className="border-t border-white/20 mt-6 pt-6 flex justify-between font-black text-2xl"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  )
}
