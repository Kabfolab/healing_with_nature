import { NextRequest } from 'next/server'

export async function POST(req: NextRequest){
  const { reference } = await req.json()
  const secret = process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET
  if(!secret) return Response.json({status:false, message:'Secret key missing on Vercel'}, {status:500})
  
  const r = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${secret}` }
  })
  const data = await r.json()
  return Response.json(data)
}
