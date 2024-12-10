"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(null)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">About Us</h2>
          <p className="text-sm">
            We provide AI-powered property search solutions to help you find the
            perfect home faster.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="text-sm">
            <li>
              <Link href="/about" passHref>
                <span className="hover:text-gray-400">About Us</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" passHref>
                <span className="hover:text-gray-400">Contact</span>
              </Link>
            </li>
            <li>
              <Link href="/terms" passHref>
                <span className="hover:text-gray-400">Terms & Conditions</span>
              </Link>
            </li>
            <li>
              <Link href="/privacy" passHref>
                <span className="hover:text-gray-400">Privacy Policy</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
          <div className="flex gap-4">
            <Link href="https://www.facebook.com" passHref>
              <span className="text-2xl hover:text-gray-400" target="_blank">
                <i className="fab fa-facebook"></i>
              </span>
            </Link>
            <Link href="https://www.twitter.com" passHref>
              <span className="text-2xl hover:text-gray-400" target="_blank">
                <i className="fab fa-twitter"></i>
              </span>
            </Link>
            <Link href="https://www.instagram.com" passHref>
              <span className="text-2xl hover:text-gray-400" target="_blank">
                <i className="fab fa-instagram"></i>
              </span>
            </Link>
            <Link href="https://www.linkedin.com" passHref>
              <span className="text-2xl hover:text-gray-400" target="_blank">
                <i className="fab fa-linkedin"></i>
              </span>
            </Link>
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          {currentYear && (
            <p className="text-sm text-center sm:text-left mt-4 sm:mt-0">
              © {currentYear} AI Property Search. All rights reserved.
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer
