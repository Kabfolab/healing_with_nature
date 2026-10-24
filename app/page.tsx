import Link from 'next/link';
export default function Home(){
  return (
    <div className="min-h-screen">
      <nav className="bg-[#0f4c1f] p-4 flex justify-between items-center text-white">
        <span className="font-bold text-xl">🌿 Nature Store</span>
        <Link href="/login" className="bg-white text-green-900 px-4 py-1.5 rounded-lg text-sm font-bold">Login</Link>
      </nav>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000" className="rounded-[24px] w-full h-[350px] md:h-[500px] object-cover shadow-lg"/>
        <h1 className="text-4xl md:text-6xl font-black text-center mt-8">Power of Nature<br/>Healing 🌿</h1>
        <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto">We provide 100% natural healing products, herbs, oils and organic supplements to restore your health naturally. No chemicals. No side effects. Trusted by over 2,000 customers across Nigeria.</p>
        <div className="grid grid-cols-3 gap-3 mt-8 max-w-lg mx-auto">
          <div className="bg-white border rounded-2xl p-4 text-center text-sm font-medium">🌱<br/>100% Natural</div>
          <div className="bg-white border rounded-2xl p-4 text-center text-sm font-medium">🚚<br/>Fast Delivery</div>
          <div className="bg-white border rounded-2xl p-4 text-center text-sm font-medium">💚<br/>Trusted Healing</div>
        </div>
        <Link href="/login" className="block bg-[#0f4c1f] text-white text-center py-4 rounded-2xl max-w-lg mx-auto mt-8 font-bold">Get Started - Login / Sign Up</Link>
      </div>
    </div>
  )
}
