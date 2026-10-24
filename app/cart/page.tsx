"use client"
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function Cart(){
  const {cart, removeFromCart, total} = useCart()
  if(cart.length===0) return (
    <div className="min-h-screen bg-[#f8fdf8] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm">🛒</div>
      <h2 className="text-2xl font-black mt-6">Your cart is empty</h2>
      <p className="text-gray-500 mt-2 max-w-sm">Looks like you haven't added any natural products yet. Start healing today.</p>
      <Link href="/shop" className="mt-6 bg-[#0f4c1f] text-white px-8 py-3.5 rounded-full font-bold">Explore Shop</Link>
    </div>
  )
  return (
    <div className="min-h-screen bg-[#f8fdf8]">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <Link href="/shop" className="text-sm font-bold text-gray-500">← Continue Shopping</Link>
        <h1 className="text-3xl md:text-4xl font-black mt-4 mb-8">Cart ({cart.length})</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item:any)=>(
              <div key={item.id} className="bg-white p-4 rounded-[20px] shadow-sm flex gap-4 items-center">
                <img src={item.image_url} className="w-20 h-20 rounded-2xl object-cover"/>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  <p className="font-black mt-1">₦{(item.price*item.qty).toLocaleString()}</p>
                </div>
                <button onClick={()=>removeFromCart(item.id)} className="w-9 h-9 bg-red-50 text-red-500 rounded-full">✕</button>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-[24px] shadow-sm h-fit sticky top-24">
            <h3 className="font-black text-lg">Order Summary</h3>
            <div className="flex justify-between mt-4 text-sm"><span className="text-gray-500">Subtotal</span><span className="font-bold">₦{total.toLocaleString()}</span></div>
            <div className="flex justify-between mt-2 text-sm"><span className="text-gray-500">Delivery</span><span className="font-bold text-green-600">Free</span></div>
            <div className="border-t mt-4 pt-4 flex justify-between font-black text-xl"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
            <Link href="/checkout" className="block text-center mt-6 bg-[#0f4c1f] text-white py-4 rounded-full font-bold shadow-lg shadow-green-900/20">Proceed to Checkout</Link>
            <p className="text-[11px] text-center text-gray-400 mt-3">🔒 Secure payment with Paystack</p>
          </div>
        </div>
      </div>
    </div>
  )
}
