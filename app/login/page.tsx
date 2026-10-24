"use client"
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function Login(){
  const router = useRouter()
  const [loading,setLoading]=useState(false)
  const handle = async (e:any)=>{
    e.preventDefault(); setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: e.target.email.value, password: e.target.password.value
    })
    if(error){ alert(error.message); setLoading(false); return }
    const {data:profile} = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    if(profile?.role==='admin') router.push('/admin')
    else router.push('/shop')
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handle} className="w-full max-w-md bg-white p-8 rounded-[24px] shadow-xl">
        <h2 className="text-3xl font-black mb-6">Welcome Back 🌿</h2>
        <input name="email" type="email" required placeholder="Email" className="w-full p-3.5 border rounded-xl mb-3"/>
        <input name="password" type="password" required placeholder="Password" className="w-full p-3.5 border rounded-xl mb-6"/>
        <button disabled={loading} className="w-full bg-[#0f4c1f] text-white py-3.5 rounded-xl font-bold">{loading?'Loading...':'Login'}</button>
        <p className="text-center mt-4 text-sm">No account? <Link href="/signup" className="text-green-700 font-bold">Sign Up</Link></p>
      </form>
    </div>
  )
}
