"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function Shop(){
  const [products,setProducts]=useState<any[]>([])
  const [search,setSearch]=useState('')
  const [category,setCategory]=useState('All')
  const {addToCart, count} = useCart()

  useEffect(()=>{
    supabase.from('products').select('*').order('created_at',{ascending:false}).then(({data})=>setProducts(data||[]))
  },[])

  const categories = ['All', ...Array.from(new Set(products.map(p=>p.category).filter(Boolean)))]
  const filtered = products.filter(p=>{
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category==='All' || p.category===category
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen bg-[#f8fdf8]">
      {/* NAV */}
      <nav className="bg-white border-b sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#0f4c1f] rounded-full flex items-center justify-center text-white font-bold">🌿</div>
            <span className="font-black text-lg">Power of Nature</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <span className="text-gray-400 mr-2">🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." className="bg-transparent outline-none text-sm w-64"/>
            </div>
            <Link href="/cart" className="relative bg-[#0f4c1f] text-white px-5 py-2.5 rounded-full font-bold text-sm">
              Cart • {count}
              {count>0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
            </Link>
          </div>
        </div>
        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search herbs, oils..." className="w-full bg-gray-100 p-3.5 rounded-2xl outline-none"/>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* HERO */}
        <div className="bg-[#0f4c1f] rounded-[24px] md:rounded-[32px] p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">Natural Healing,<br/>Delivered to You.</h2>
            <p className="text-white/70 mt-3 max-w-md">100% organic herbs & oils trusted by 2,000+ Nigerians. Fast delivery nationwide.</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
            <p className="text-3xl font-black">{products.length}+</p><p className="text-xs text-white/70">Products</p>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="flex gap-2 overflow-x-auto py-6 scrollbar-hide">
          {categories.map(cat=>(
            <button key={cat} onClick={()=>setCategory(cat)} className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition ${category===cat?'bg-[#0f4c1f] text-white shadow-lg':'bg-white border text-gray-600'}`}>{cat}</button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(p=>(
            <div key={p.id} className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative overflow-hidden">
                <img src={p.image_url} className="h-48 md:h-60 w-full object-cover group-hover:scale-110 transition duration-500"/>
                {p.old_price && <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">SALE</span>}
                <button onClick={()=>{addToCart(p); toast.success('Added to cart 🛒')}} className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition">🛒</button>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold tracking-widest text-green-700 uppercase">{p.category}</p>
                <h3 className="font-bold text-sm md:text-base leading-tight mt-1 line-clamp-2 h-10">{p.name}</h3>
                <div className="flex items-end justify-between mt-3">
                  <div>
                    <p className="font-black text-lg">₦{Number(p.price).toLocaleString()}</p>
                    {p.old_price && <p className="text-xs line-through text-gray-400">₦{Number(p.old_price).toLocaleString()}</p>}
                  </div>
                  <button onClick={()=>{addToCart(p); toast.success('Added!')}} className="bg-[#f1f5f1] hover:bg-[#0f4c1f] hover:text-white text-[#0f4c1f] px-4 py-2 rounded-full text-xs font-black transition">ADD</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
        }
