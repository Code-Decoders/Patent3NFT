import React from 'react'
import styles from '../styles/TabButton.module.css';

const TabButton = ({ name, active, onClick }) => {
    if (!active) {
        active = false;
    }
    return (
        <div className={styles.button} style={active ? { background: 'var(--linear-gradient)' } : {}} onClick={onClick}>{name}</div>
    )
}

export default TabButton