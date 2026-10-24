import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import Footer, { WhatsAppFloat } from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <WhatsAppFloat />
          <Toaster position="bottom-center"/>
        </CartProvider>
      </body>
    </html>
  );
}
