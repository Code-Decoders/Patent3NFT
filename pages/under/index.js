import Link from 'next/link'
import React from 'react'
import styles from '../../styles/Under.module.css'

const Under = () => {
    return (
        <div className={styles.container}>
            <img src="images/under.png" className={styles.image} />
            <div className={styles.title}>Coming Soon</div>
            <div className={styles.subtitle}>Website is under construction</div>
            <Link href="/"><div className={styles.button}>Go to HomePage</div></Link>
        </div>
    )
}

export default Under