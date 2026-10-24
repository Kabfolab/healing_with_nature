"use client"
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Signup(){
  const handle = async (e:any)=>{
    e.preventDefault()
    const email=e.target.email.value, password=e.target.password.value, full_name=e.target.name.value, phone=e.target.phone.value
    const {data, error} = await supabase.auth.signUp({email,password})
    if(error) return alert(error.message)
    await supabase.from('profiles').insert({id:data.user?.id, email, full_name, phone, role:'user'})
    alert("Account created! Now login")
    window.location.href='/login'
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handle} className="w-full max-w-md bg-white p-8 rounded-[24px] shadow-xl space-y-3">
        <h2 className="text-3xl font-black">Create Account 🌿</h2>
        <input name="name" required placeholder="Full Name" className="w-full p-3.5 border rounded-xl"/>
        <input name="phone" required placeholder="Phone Number" className="w-full p-3.5 border rounded-xl"/>
        <input name="email" type="email" required placeholder="Email" className="w-full p-3.5 border rounded-xl"/>
        <input name="password" type="password" required placeholder="Password" className="w-full p-3.5 border rounded-xl"/>
        <button className="w-full bg-[#0f4c1f] text-white py-3.5 rounded-xl font-bold">Sign Up</button>
      </form>
    </div>
  )
}
