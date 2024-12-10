import "./globals.css"
import Navbar from "../components/navbar"
import { inter } from "./ui/fonts"
import React from "react"
import ErrorBoundary from "./ui/ErrorBoundry/errorboundry"
import FloatingMessages from "./ui/FloatingMesage.js/floatingmessage"
import Footer from "./ui/footer/footer"
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <main className={`${inter.className}`}>
            <Navbar />
            {children}
            <FloatingMessages />
            <Footer />
          </main>
        </ErrorBoundary>
      </body>
    </html>
  )
}
