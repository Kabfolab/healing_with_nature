import Link from 'next/link'

export default function Footer(){
  const waNumber = "2348036483048"
  const waLink = `https://wa.me/${waNumber}?text=Hello%20Power%20of%20Nature%20Healing%20🌿%20I%20want%20to%20order`

  // 👇 PUT YOUR REAL LINKS HERE - Just replace #
  const socials = {
    whatsapp: waLink,
    facebook: "https://facebook.com/powerofnaturehealing", // replace with yours
    instagram: "https://instagram.com/powerofnaturehealing", // replace
    tiktok: "https://tiktok.com/@powerofnature", // replace
    youtube: "https://youtube.com/@powerofnature", // optional
  }

  return (
    <footer className="bg-[#0f1a0f] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-black text-2xl flex items-center gap-2">🌿 Power of Nature Healing</h3>
            <p className="text-white/60 text-sm mt-3 max-w-md leading-relaxed">
              100% natural healing products, herbs, oils and organic supplements. No chemicals. 
              Trusted by 2,000+ customers across Nigeria. Follow us everywhere.
            </p>
            
            {/* SOCIAL ICONS */}
            <div className="flex gap-3 mt-6">
              <a href={socials.whatsapp} target="_blank" className="w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center font-bold hover:scale-110 transition">W</a>
              <a href={socials.facebook} target="_blank" className="w-11 h-11 bg-[#1877F2] rounded-full flex items-center justify-center font-bold hover:scale-110 transition">f</a>
              <a href={socials.instagram} target="_blank" className="w-11 h-11 bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] rounded-full flex items-center justify-center font-bold hover:scale-110 transition">IG</a>
              <a href={socials.tiktok} target="_blank" className="w-11 h-11 bg-black border border-white/20 rounded-full flex items-center justify-center font-bold hover:scale-110 transition">TT</a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <div className="space-y-2.5 text-sm text-white/60">
              <Link href="/shop" className="block hover:text-white">Shop</Link>
              <Link href="/cart" className="block hover:text-white">Cart</Link>
              <Link href="/orders" className="block hover:text-white">My Orders</Link>
              <a href={socials.whatsapp} target="_blank" className="block hover:text-white">Chat Support</a>
            </div>
          </div>

          {/* Contact + Social List */}
          <div>
            <h4 className="font-bold mb-4">Connect With Us</h4>
            <div className="space-y-3 text-sm">
              <a href={socials.whatsapp} target="_blank" className="flex items-center gap-2 text-white/80 hover:text-white"><span className="w-7 h-7 bg-[#25D366] rounded-full flex items-center justify-center text-xs">W</span> WhatsApp: +234 803 648 3048</a>
              <a href={socials.facebook} target="_blank" className="flex items-center gap-2 text-white/60 hover:text-white"><span className="w-7 h-7 bg-[#1877F2] rounded-full flex items-center justify-center text-xs">f</span> Facebook</a>
              <a href={socials.instagram} target="_blank" className="flex items-center gap-2 text-white/60 hover:text-white"><span className="w-7 h-7 bg-[#d62976] rounded-full flex items-center justify-center text-xs">IG</span> Instagram</a>
              <a href={socials.tiktok} target="_blank" className="flex items-center gap-2 text-white/60 hover:text-white"><span className="w-7 h-7 bg-white text-black rounded-full flex items-center justify-center text-xs">TT</span> TikTok</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/30">© 2026 Power of Nature Healing. All rights reserved.</p>
          <p className="text-xs text-white/30">Made with 💚 for natural healing • Follow us for health tips daily!</p>
        </div>
      </div>
    </footer>
  )
}

export function WhatsAppFloat(){
  const waLink = `https://wa.me/2348036483048?text=Hello%20Power%20of%20Nature%20Healing%20🌿%20I%20need%20help`
  return (
    <a href={waLink} target="_blank" className="fixed bottom-6 right-6 z-[999] bg-[#25D366] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all animate-bounce">
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.54 2 2.07 6.47 2.07 11.96c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.82 9.82 0 0 0 4.78 1.22h0c5.49 0 9.96-4.47 9.96-9.96a9.81 9.81 0 0 0-2.94-6.97Zm-7.02 15.2h0a8.17 8.17 0 0 1-4.16-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.3 8.3 0 0 1-1.28-4.3c0-4.6 3.74-8.34 8.34-8.34a8.3 8.3 0 0 1 5.9 2.45 8.3 8.3 0 0 1 2.44 5.9c0 4.6-3.75 8.34-8.35 8.34Zm4.57-6.23c-.25-.13-1.48-.73-1.71-.81s-.4-.13-.57.13-.66.81-.81.98-.3.19-.55.06a6.98 6.98 0 0 1-2.05-1.27 7.73 7.73 0 0 1-1.43-1.78c-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44s.17-.25.25-.42.04-.31-.02-.44-.57-1.37-.78-1.88c-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.31s-.88.86-.88 2.1.9 2.44 1.03 2.61c.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19s.21-1.09.14-1.19c-.06-.1-.23-.16-.48-.29Z"/></svg>
    </a>
  )
}
