'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {
    path: string;
    name: string;
}

const NavLink: React.FC<Props> = ({name, path}) => {
    const pathname = usePathname()

  return (
    <Link className={`text-gray-500 hover:text-gray-700 duration-200  ${pathname === path ? 'text-gray-900' : '' }`} href={path}>
    {name}
  </Link>
  )
}

export default NavLink
