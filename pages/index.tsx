import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import NftDropPage from './nft'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>NFT-DROP-REACT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NftDropPage />
    </>
  )
}

export default Home
