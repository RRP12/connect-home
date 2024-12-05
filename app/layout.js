import "./globals.css";
import Navbar from "../components/navbar";
import { inter } from "./ui/fonts";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <main className={`${inter.className}`}>
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
