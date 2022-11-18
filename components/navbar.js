import Link from "next/link";
import React, { useEffect, useState } from "react";
import { initializeWeb3 } from "../lib/web3Adaptor";
import styles from "../styles/Navbar.module.css";
const Navbar = () => {
  const [address, setAddress] = useState(null);

  const handleClick = () => {
    if (address) {
      setAddress(null);
    } else {
      initializeWeb3().then((res) => {
        setAddress(res.accounts[0]);
      });
    }
  };

  useEffect(() => {
    initializeWeb3().then((res) => {
      setAddress(res?.accounts[0]);
    });
  }, []);

  return (
    <div className={styles.container}>
      <Link href="/">
        <img
          src="http://patent3.netlify.app/images/Logo.png"
          className={styles.logo}
        />
      </Link>
      <div className={styles.menu}>
        <div
          className={styles.menuitem}
          onClick={() => {
            if (window.location.pathname === "/") {
              document.getElementById("Explore").scrollIntoView();
            } else {
              window.location.href = "/#Explore";
            }
          }}
        >
          Explore
        </div>
        <Link href={"/under"}>
          <div className={styles.menuitem}>Stats</div>
        </Link>
        <Link href={"/under"}>
          <div className={styles.menuitem}>Resources</div>
        </Link>
        <Link href={"/under"}>
          <div className={styles.menuitem}>Artists</div>
        </Link>
        <Link href={"/create"}>
          <div className={styles.menuitem}>Create</div>
        </Link>
      </div>
      <div className={styles.button} onClick={handleClick}>
        {address ? address.slice(0, 10) + "..." : "Connect Wallet"}
      </div>
    </div>
  );
};

export default Navbar;
