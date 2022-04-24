import React, { useEffect, useState } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings.d'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import toast, { Toaster } from 'react-hot-toast'
import Head from 'next/head'

interface Props {
  collection: Collection
}

const NftDropPage = ({ collection }: Props) => {
  const connectWithMetaMask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  const nftDrop = useNFTDrop(collection.address)
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [isLoading, setIsLoading] = useState(false)
  const [priceInEth, setPriceInEth] = useState<string>()
  useEffect(() => {
    if (nftDrop) {
      const fetchNftData = async () => {
        setIsLoading(true)
        const claimed = await nftDrop.getAllClaimed()
        const totalSupplied = await nftDrop.totalSupply()
        setClaimedSupply(claimed.length)
        setTotalSupply(totalSupplied)
        setIsLoading(false)
      }
      fetchNftData()
    }
  }, [nftDrop])
  useEffect(() => {
    if (nftDrop) {
      const fetchPrice = async () => {
        const claimConditions = await nftDrop.claimConditions.getAll()
        setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
      }
      fetchPrice()
    }
  }, [nftDrop])

  const mintNft = () => {
    if (!nftDrop || !address) return
    const quantity = 1
    setIsLoading(true)
    const notifyStyle = {
      background: 'white',
      color: 'green',
      fontWeight: 'bolder',
      fontSize: '17px',
      padding: '20px',
    }
    const notification = toast.loading('Minting NFT...', {
      style: {
        ...notifyStyle,
      },
    })
    nftDrop
      .claimTo(address, quantity)
      .then(async (transac) => {
        toast('Congrats... You Successfully Minted!', {
          duration: 8000,
          style: {
            ...notifyStyle,
            background: 'green',
            color: 'white',
          },
        })
        const receipt = transac[0].receipt
        const claimedToken = transac[0].id
        const claimedNft = await transac[0].data()
        console.log({ receipt, claimedNft, claimedToken })
      })
      .catch((err) => {
        console.log(err)
        toast('OOps... Something went wrong!', {
          duration: 8000,
          style: {
            ...notifyStyle,
            background: 'red',
            color: 'white',
          },
        })
      })
      .finally(() => {
        toast.dismiss(notification)
        setIsLoading(false)
      })
  }
  return (
    <div className=" flex h-screen flex-col lg:grid lg:grid-cols-10 ">
      <Head>
        <title>NFT-DROP-REACT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center" />
      <div className=" bg-gradient-to-br  from-cyan-800 to-rose-500 lg:col-span-4 ">
        <div className=" flex flex-col items-center justify-center py-2 lg:min-h-screen ">
          <div className=" rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2 ">
            <img
              src={urlFor(collection.previewImage).url()}
              alt="nft pic"
              className="w-44 rounded-xl object-cover lg:w-72 "
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className=" text-4xl font-bold text-white ">
              {collection.nftCollectionName}
            </h1>
            <h2 className=" text-xl text-gray-300 ">
              {collection.description}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        <header className="flex items-center justify-between ">
          <Link href={'/'}>
            <h1 className=" w-52 cursor-pointer text-xl font-extralight sm:w-80 ">
              The{' '}
              <span className=" font-extrabold underline decoration-pink-600 ">
                NFT
              </span>{' '}
              Market Place
            </h1>
          </Link>
          <button
            className=" rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-2 lg:text-base "
            onClick={() => (address ? disconnect() : connectWithMetaMask())}
          >
            {address ? `Sign out` : 'Sign up'}
          </button>
        </header>
        <hr className="my-2 border" />
        {address && (
          <p className=" text-center text-sm text-rose-400 ">
            You`re loggedIn with wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src={urlFor(collection.mainImage).url()}
            alt="mainImage"
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold ">
            {collection.title}
          </h1>
          {isLoading ? (
            <img
              className=" h-40 w-80 object-contain "
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
            />
          ) : (
            <p className=" pt-2 text-xl text-green-500 ">
              {claimedSupply}/{totalSupply?.toString()} NFT`s Claimed
            </p>
          )}
        </div>
        <button
          onClick={mintNft}
          disabled={
            isLoading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className=" mt-10 h-16 w-full rounded-full  bg-red-600 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-400 "
        >
          {isLoading ? (
            'Loading...'
          ) : claimedSupply === totalSupply?.toNumber() ? (
            'Sold Out'
          ) : !address ? (
            'Sign in to mint'
          ) : (
            <span className=" font-bold ">Mint NFT ({priceInEth} ETH)</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default NftDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type=="collection" && slug.current ==$id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage{
      asset
    },
    previewImage{
      asset
    },
    slug{
      current
    },
    creator->{
      _id,
      name,
      address,
      slug{
        current
      }
    }
  }`
  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })
  if (!collection) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      collection,
    },
  }
}
