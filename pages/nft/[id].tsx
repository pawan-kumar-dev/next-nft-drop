import React from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

const NftDropPage = () => {
  const connectWithMetaMask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  console.log(address)
  return (
    <div className=" flex h-screen flex-col lg:grid lg:grid-cols-10 ">
      <div className=" bg-gradient-to-br  from-cyan-800 to-rose-500 lg:col-span-4 ">
        <div className=" flex flex-col items-center justify-center py-2 lg:min-h-screen ">
          <div className=" rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2 ">
            <img
              src="https://i.guim.co.uk/img/media/ef8492feb3715ed4de705727d9f513c168a8b196/37_0_1125_675/master/1125.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=d456a2af571d980d8b2985472c262b31"
              alt="nft pic"
              className="w-44 rounded-xl object-cover lg:w-72 "
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className=" text-4xl font-bold text-white ">
              Next.js App NFT Drop
            </h1>
            <h2 className=" text-xl text-gray-300 ">A collection of apes</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        <header className="flex items-center justify-between ">
          <h1 className=" w-52 cursor-pointer text-xl font-extralight sm:w-80 ">
            The{' '}
            <span className=" font-extrabold underline decoration-pink-600 ">
              NFT
            </span>{' '}
            Market Place
          </h1>
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
            src="https://www.aljazeera.com/wp-content/uploads/2021/12/nft.jpg"
            alt="mainImage"
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold ">
            The Next App Coding Club | NFT Drop
          </h1>
          <p className=" pt-2 text-xl text-green-500 ">13/12 NFT`s Claimed</p>
        </div>
        <button className=" mt-10 h-16 w-full  rounded-full bg-red-600 font-bold text-white ">
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  )
}

export default NftDropPage
