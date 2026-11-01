import { NextResponse } from 'next/server'
export async function POST(req){
  const {reference}=await req.json()
  const secret=process.env.PAYSTACK_SECRET_KEY
  const r=await fetch(`https://api.paystack.co/transaction/verify/${reference}`,{
    headers:{Authorization:`Bearer ${secret}`}
  })
  const data=await r.json()
  return NextResponse.json(data)
}
