import Link from 'next/link'
import React from 'react'
import styles from '../styles/Footer.module.css'

const Footer = () => {
    return (
        <div className={styles.container}>
            <div style={{ flex: 1 }}>
                <img src="http://patent3.netlify.app/images/Logo.png" className={styles.logo}/>
                <div className={styles.text}>Unique Patent NFTs Marketplace. rare and authentic <br />digital ideas</div>
                <div className={styles.social}>
                    <img src="http://patent3.netlify.app/images/fb.svg" />
                    <img src="http://patent3.netlify.app/images/discord.svg" />
                    <img src="http://patent3.netlify.app/images/instagram.svg" />
                    <img src="http://patent3.netlify.app/images/yt.svg" />
                </div>
            </div>
            <div className={styles.actionColumn}>
                <Link href="/under"><div className={styles.action}>Marketplace</div></Link>
                <Link href="/under"><div className={styles.action}>Explore</div></Link>
                <Link href="/under"><div className={styles.action}>Stats</div></Link>
                <Link href="/under"><div className={styles.action}>Create</div></Link>
            </div>
            <div className={styles.actionColumn}>
                <Link href="/under"><div className={styles.action}>Resources</div></Link>
                <Link href="/under"><div className={styles.action}>Blogs</div></Link>
                <Link href="/under"><div className={styles.action}>Help Center</div></Link>
                <Link href="/under"><div className={styles.action}>Partners</div></Link>
            </div>
            <div className={styles.actionColumn}>
                <div className={styles.action} onClick={() => {
                    if (window.location.pathname === '/') {
                        document.getElementById('About').scrollIntoView();
                    } else {
                        window.location.href = '/#About';
                    }
                }}>About Us</div>
                <Link href="/under"><div className={styles.action}>Career</div></Link>
                <Link href="/under"><div className={styles.action}>Support</div></Link>
            </div>
        </div>
    )
}

export default Footer