"use client"
import { useState, useEffect } from 'react'

export default function Checkout(){
  const [loading,setLoading]=useState(false)
  const [ready,setReady]=useState(false)

  useEffect(()=>{
    const s=document.createElement('script')
    s.src='https://js.paystack.co/v1/inline.js'
    s.onload=()=>setReady(true)
    document.body.appendChild(s)
  },[])

  const pay = ()=>{
    setLoading(true)
    try{
      const PAYSTACK_KEY = "pk_test_f3a6e7d8b2c9a1e4f5d6c7b8a9e0f1d2c3b4a5d6" // REPLACE with your real pk_test_... key
      console.log("KEY:", PAYSTACK_KEY)
      // @ts-ignore
      if(!(window as any).PaystackPop){
        alert("PaystackPop not loaded")
        setLoading(false)
        return
      }
      // @ts-ignore
      const handler = (window as any).PaystackPop.setup({
        key: PAYSTACK_KEY,
        email: "kabfolab@gmail.com",
        amount: 1000000, // 10k in kobo
        currency: 'NGN',
        ref: ''+Date.now(),
        onClose: ()=>setLoading(false),
        callback: (res:any)=>{
          alert("Success! "+res.reference)
          setLoading(false)
        }
      })
      handler.openIframe()
    }catch(err:any){
      alert("REAL ERROR: "+ (err?.message || JSON.stringify(err)))
      console.error(err)
      setLoading(false)
    }
  }

  return(
    <div style={{padding:20}}>
      <h1>Checkout {ready ? '✓ ready' : 'loading...'}</h1>
      <button onClick={pay} disabled={loading} style={{background:'#0f4c1f', color:'white', padding:'16px 32px', borderRadius:999, marginTop:20}}>
        {loading ? 'Processing...' : 'TEST Pay ₦10,000'}
      </button>
    </div>
  )
}
