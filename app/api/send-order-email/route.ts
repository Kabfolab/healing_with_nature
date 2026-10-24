import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest){
  const body = await req.json()
  const { customer_name, customer_email, customer_phone, shipping_address, total, items, ref } = body

  // 1. Try Resend if you added key, else fallback
  try{
    if(process.env.RESEND_API_KEY){
      await fetch('https://api.resend.com/emails',{
        method:'POST',
        headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type':'application/json'},
        body: JSON.stringify({
          from: 'Power of Nature <orders@powerofnature.com>',
          to: process.env.ADMIN_EMAIL!,
          subject: `🌿 NEW ORDER: ${customer_name} - ₦${Number(total).toLocaleString()}`,
          html: `
            <div style="font-family:sans-serif; padding:20px; background:#f8fdf8">
              <h1 style="color:#0f4c1f">New Order Paid! 🎉</h1>
              <p><b>Name:</b> ${customer_name}</p>
              <p><b>Phone:</b> ${customer_phone} (CALL FOR DELIVERY)</p>
              <p><b>Email:</b> ${customer_email}</p>
              <p><b>Address:</b> ${shipping_address}</p>
              <p><b>Total:</b> ₦${Number(total).toLocaleString()}</p>
              <p><b>Paystack Ref:</b> ${ref}</p>
              <hr/>
              <h3>Items:</h3>
              <ul>${items.map((i:any)=>`<li>${i.name} x ${i.qty} - ₦${i.price}</li>`).join('')}</ul>
            </div>
          `
        })
      })
    }
  }catch(e){ console.log("Email error", e) }

  return NextResponse.json({ok:true})
}
