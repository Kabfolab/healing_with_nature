"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'

type Tab = 'overview' | 'products' | 'orders' | 'add'

export default function Admin(){
  const [tab,setTab]=useState<Tab>('overview')
  const [products,setProducts]=useState<any[]>([])
  const [orders,setOrders]=useState<any[]>([])
  const [uploading,setUploading]=useState(false)

  const load = async ()=>{
    const {data:prods} = await supabase.from('products').select('*').order('created_at',{ascending:false})
    const {data:ords} = await supabase.from('orders').select('*').order('created_at',{ascending:false})
    setProducts(prods||[]); setOrders(ords||[])
  }
  useEffect(()=>{load()},[])

  const addProduct = async (e:any)=>{
    e.preventDefault(); setUploading(true)
    try{
      const file = e.target.image.files[0]
      if(!file) throw new Error("Select image")
      const fileName = Date.now()+"_"+file.name.replaceAll(" ","_")
      const {error:upError} = await supabase.storage.from('product-images').upload(fileName, file)
      if(upError) throw upError
      const {data:{publicUrl}} = supabase.storage.from('product-images').getPublicUrl(fileName)
      
      const {error} = await supabase.from('products').insert({
        name: e.target.name.value,
        price: Number(e.target.price.value),
        old_price: e.target.old_price.value ? Number(e.target.old_price.value) : null,
        category: e.target.category.value,
        description: e.target.desc.value,
        stock: Number(e.target.stock.value),
        is_featured: e.target.featured.checked,
        image_url: publicUrl
      })
      if(error) throw error
      toast.success("Product added 🌿")
      e.target.reset(); load(); setTab('products')
    }catch(err:any){ toast.error(err.message) }
    setUploading(false)
  }

  const deleteProduct = async (id:string)=>{
    if(!confirm("Delete product?")) return
    await supabase.from('products').delete().eq('id',id)
    toast.success("Deleted"); load()
  }

  const totalSales = orders.reduce((a,b)=>a+Number(b.total||0),0)

  return (
    <div className="min-h-screen bg-[#f8faf8] flex">
      <Toaster/>
      {/* SIDEBAR - Desktop */}
      <aside className="hidden md:flex w-64 bg-[#0f1a0f] text-white flex-col p-6 fixed h-screen">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold">🌿</div>
          <span className="font-black">Nature Admin</span>
        </Link>
        <nav className="space-y-2">
          {[
            {id:'overview', label:'Overview', icon:'📊'},
            {id:'products', label:'Products', icon:'📦'},
            {id:'orders', label:'Orders', icon:'🧾'},
            {id:'add', label:'Add Product', icon:'➕'},
          ].map(item=>(
            <button key={item.id} onClick={()=>setTab(item.id as Tab)} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition ${tab===item.id?'bg-white text-black':'text-white/60 hover:bg-white/10 hover:text-white'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <Link href="/shop" className="block text-center bg-white/10 py-3 rounded-xl text-sm font-bold">View Shop →</Link>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-64">
        {/* Mobile Tabs */}
        <div className="md:hidden bg-[#0f1a0f] p-4 flex gap-2 overflow-x-auto sticky top-0 z-40">
          {['overview','products','orders','add'].map(t=>(
            <button key={t} onClick={()=>setTab(t as Tab)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${tab===t?'bg-white text-black':'bg-white/10 text-white/70'}`}>{t.toUpperCase()}</button>
          ))}
        </div>

        <div className="p-4 md:p-8">
          {tab==='overview' && (
            <>
              <h1 className="text-3xl md:text-4xl font-black">Good morning, Admin 🌿</h1>
              <p className="text-gray-500 mt-1">Here's what's happening today.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <div className="bg-white p-6 rounded-[20px] shadow-sm"><p className="text-xs text-gray-400 font-bold tracking-widest">TOTAL SALES</p><p className="text-2xl font-black mt-2">₦{totalSales.toLocaleString()}</p></div>
                <div className="bg-white p-6 rounded-[20px] shadow-sm"><p className="text-xs text-gray-400 font-bold tracking-widest">ORDERS</p><p className="text-2xl font-black mt-2">{orders.length}</p></div>
                <div className="bg-white p-6 rounded-[20px] shadow-sm"><p className="text-xs text-gray-400 font-bold tracking-widest">PRODUCTS</p><p className="text-2xl font-black mt-2">{products.length}</p></div>
                <div className="bg-[#0f4c1f] text-white p-6 rounded-[20px] shadow-lg"><p className="text-xs text-white/60 font-bold tracking-widest">STATUS</p><p className="text-xl font-black mt-2">Live & Healthy ✅</p></div>
              </div>
              <div className="bg-white rounded-[20px] p-6 mt-8 shadow-sm">
                <h3 className="font-black mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0,5).map((o:any)=>(
                    <div key={o.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm">
                      <div><p className="font-bold">{o.customer_name}</p><p className="text-xs text-gray-500">{o.customer_phone}</p></div>
                      <span className="font-black">₦{Number(o.total).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab==='products' && (
            <>
              <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-black">Products ({products.length})</h1><button onClick={()=>setTab('add')} className="bg-[#0f4c1f] text-white px-5 py-2.5 rounded-full text-sm font-bold">+ New Product</button></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p=>(
                  <div key={p.id} className="bg-white rounded-[20px] overflow-hidden shadow-sm">
                    <img src={p.image_url} className="h-40 w-full object-cover"/>
                    <div className="p-4">
                      <p className="text-[10px] font-bold text-green-700 uppercase">{p.category}</p>
                      <h4 className="font-bold text-sm line-clamp-1">{p.name}</h4>
                      <p className="font-black mt-1">₦{Number(p.price).toLocaleString()}</p>
                      <button onClick={()=>deleteProduct(p.id)} className="mt-3 w-full bg-red-50 text-red-600 py-2 rounded-xl text-xs font-bold">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab==='orders' && (
            <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
              <div className="p-6 border-b"><h1 className="text-2xl font-black">Orders • Admin Inbox</h1><p className="text-sm text-gray-500">When user pays, you get email + this list with phone to call for delivery</p></div>
              <div className="divide-y">
                {orders.map((o:any)=>(
                  <div key={o.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between"><span className="font-black">{o.customer_name}</span><span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold">{o.status}</span></div>
                    <p className="text-sm mt-2">📞 {o.customer_phone} • ✉️ {o.customer_email}</p>
                    <p className="text-sm text-gray-500">📍 {o.shipping_address}</p>
                    <p className="text-sm mt-2 font-bold">Items: {o.items?.map((i:any)=>`${i.name} x${i.qty}`).join(', ')}</p>
                    <p className="font-black text-lg mt-2">₦{Number(o.total).toLocaleString()} • Ref: {o.paystack_ref}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='add' && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-black mb-6">Add New Product</h1>
              <form onSubmit={addProduct} className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="name" required placeholder="Product Name e.g. Moringa Powder" className="p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 md:col-span-2"/>
                  <input name="price" type="number" required placeholder="Price ₦" className="p-4 bg-gray-50 border rounded-2xl"/>
                  <input name="old_price" type="number" placeholder="Old Price (optional)" className="p-4 bg-gray-50 border rounded-2xl"/>
                  <input name="category" required placeholder="Category (Herbs, Oils, Powder)" className="p-4 bg-gray-50 border rounded-2xl"/>
                  <input name="stock" type="number" defaultValue={100} placeholder="Stock" className="p-4 bg-gray-50 border rounded-2xl"/>
                </div>
                <textarea name="desc" required placeholder="Full Description - benefits, how to use..." className="w-full p-4 bg-gray-50 border rounded-2xl h-32"/>
                <div className="flex items-center gap-2"><input name="featured" type="checkbox" className="w-4 h-4"/><label className="text-sm font-bold">Mark as Featured</label></div>
                <div className="border-2 border-dashed rounded-2xl p-6 text-center">
                  <input name="image" type="file" accept="image/*" required className="w-full"/>
                  <p className="text-xs text-gray-400 mt-2">Upload clear product image (JPG/PNG)</p>
                </div>
                <button disabled={uploading} className="w-full bg-[#0f4c1f] text-white py-4 rounded-full font-black text-lg shadow-lg">{uploading?'Uploading Image...':'Publish Product 🌿'}</button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
      }
