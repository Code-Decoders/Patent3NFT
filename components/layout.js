import Head from 'next/head';
import React from 'react'
import styles from '../styles/Home.module.css'
import Footer from './footer';
import Navbar from './navbar';


const Layout = ({ children }) => {

    return (
        <div>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Pat3nt</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet" />

            </Head>
            <main className={styles.container}>
                <Navbar />
                {children}
                <Footer />
            </main>
            <footer className={styles.footer}>
                <div className={styles.text}>© 2022 NFT Marketplace. All rights reserved</div>
            </footer>
        </div>
    )
}

export default Layout;
