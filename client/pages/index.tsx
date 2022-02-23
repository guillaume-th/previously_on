import type { NextPage } from 'next'
import Head from 'next/head'
import Header from "./Header";

const Home: NextPage = () => {

  return (
    <div >
      <Head>
        <title>Previously On</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <p>Hello</p>
      <footer>
      </footer>
    </div>
  )
}

export default Home
