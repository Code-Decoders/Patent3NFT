import Link from "next/link";
import React, { useEffect } from "react";
import getIPFS from "../lib/getIPFS";
import { parseAddress, parseUint } from "../lib/tronAdaptor";
import styles from "../styles/Card.module.css";

const Card = ({ nft }) => {
  const [metadata, setMetadata] = React.useState(null);

  const getMetadata = async () => {
    const data = await fetch(getIPFS(nft.tokenURI));
    const json = await data.json();
    setMetadata(json);
  };
  useEffect(() => {
    getMetadata();
  }, []);

  if (!metadata) {
    return <div></div>;
  }
  return (
    <Link href={"/nfts/" + nft.tokenId}>
      <div className={styles.container}>
        <video
          src={getIPFS(metadata.animation_url)}
          className={styles.image}
          autoplay="true"
          muted="muted"
          loop
        />
        <div className={styles.details}>
          <div>
            <div className={styles.title}>{metadata.name}</div>
            <div className={styles.creator}>Created by {parseAddress(nft.owner).slice(0,10)}...</div>
            <div className={styles.offer}>Latest Offer</div>
            <div className={styles.offer}>{parseUint(nft.price)} TRX</div>
          </div>
          <div className={styles.right}>
            <img className={styles.owner} src="images/image.png" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
