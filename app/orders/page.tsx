"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function UserOrders(){
  const [orders,setOrders]=useState<any[]>([])
  useEffect(()=>{
    supabase.auth.getUser().then(async ({data:{user}})=>{
      if(!user) return
      const {data} = await supabase.from('orders').select('*').eq('user_id',user.id).order('created_at',{ascending:false})
      setOrders(data||[])
    })
  },[])
  return (
    <div className="min-h-screen bg-[#f8fdf8] p-4 md:p-8 max-w-3xl mx-auto">
      <Link href="/shop" className="text-sm font-bold">← Back to Shop</Link>
      <h1 className="text-3xl font-black mt-4 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(o=>(
          <div key={o.id} className="bg-white p-6 rounded-[20px] shadow-sm">
            <div className="flex justify-between"><span className="font-bold">{new Date(o.created_at).toLocaleDateString()}</span><span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">{o.status}</span></div>
            <p className="text-sm mt-2 text-gray-600">{o.items?.map((i:any)=>i.name).join(', ')}</p>
            <p className="font-black mt-2">₦{Number(o.total).toLocaleString()}</p>
          </div>
        ))}
        {orders.length===0 && <p className="text-gray-500">No orders yet.</p>}
      </div>
    </div>
  )
}
