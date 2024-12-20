import "./globals.css"
import { inter } from "./ui/fonts"
import React from "react"
import ErrorBoundary from "./ui/ErrorBoundry/errorboundry"
import ChatProvider from "../components/mainContext"
import SearchBar from "./SearchBar"
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ChatProvider>
          <ErrorBoundary>
            <main
              className={`${inter.className} flex h-[100%] flex-col  overflow-hidden  w-scren p-2 m-2  md:px-12 md:py-3 `}
            >
              <SearchBar />
              {children}
            </main>
          </ErrorBoundary>
        </ChatProvider>
      </body>
    </html>
  )
}

// ;<SearchBar />
