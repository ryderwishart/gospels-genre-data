import { Header } from 'antd/lib/layout/layout'
import '../styles/globals.css'
import Link from 'next/link';
import { HomeOutlined } from '@ant-design/icons'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header>
        <Link href="/">
        <HomeOutlined style={{color: 'white'}}/>
        </Link>
      </Header>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
