"use client"
import { cn } from '@/lib/utils'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const navItems = [
    {label:"Library", href:"/"},
    {label:"Add New", href:"/books/new"}
]

const Navbar = () => {
    const pathName = usePathname()
  return (
    <header className='w-full fixed z-50 bg-[var(--bg-primary)]'>
      <div className="wrapper navbar-height py-4 px-4 flex justify-between items-center">
        <Link href="/" className="flex gap-0.5 items-center">
          <Image
            src="/assets/logo.png"
            alt="Bookfied"
            width={42}
            height={26}
            priority
          />
          <span className='logo-text'>Bookified</span>
        </Link>
        <nav className='w-fit flex gap-7.5 items-center'>
          {
            navItems.map(({label, href})=>{
                 const isActive = pathName === href ||
                 (href !== "/" && pathName.startsWith(href))
                 return (
                    <Link href={href} key={label}
                    className={cn('nav-link-base', isActive? 'nav-link-active':'text-black hover:opacity-70')}>
                        {label}
                    </Link>
                 )
            })
          }
        </nav>
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton />
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}

export default Navbar
