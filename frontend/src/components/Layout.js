import { Outlet, useNavigation } from 'react-router-dom'
import Header from './Header'
import ScrollToTop from './ScrollToTop'

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
