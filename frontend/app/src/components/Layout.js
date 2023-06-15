import React, { useEffect } from 'react'
import { Outlet, useNavigation } from 'react-router-dom'
import Header from './Header'
import ScrollToTop from './ScrollToTop'
import { getCookieAuth } from '../api/auth'

export async function loader() {
  const cookie = await getCookieAuth()
  if (!cookie) {
    return null
  }
  return cookie
}

export default function Layout() {
  const navigation = useNavigation()
  return (
    <div className="site-wrapper">
      <ScrollToTop />
      <Header />
      {navigation.state === 'loading' && <h1>Loading...</h1>}
      <main>
        <Outlet />
      </main>
    </div>
  )
}
