import { Outlet, useNavigation } from 'react-router-dom'
import Header from './Header'
import CircularProgress from '@mui/material/CircularProgress'
import ScrollToTop from './ScrollToTop'
import Backdrop from '@mui/material/Backdrop'

export default function Layout() {
  const navigation = useNavigation()
  return (
    <div className="site-wrapper">
      <ScrollToTop />
      <Header />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={navigation.state === 'loading'}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
