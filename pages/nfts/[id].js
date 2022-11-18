import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import getIPFS from "../../lib/getIPFS";
import {
  getFromTokenId,
  initializeWeb3,
  makeOffer,
  approveOffer,
  cancelOffer,
} from "../../lib/web3Adaptor";
import styles from "../../styles/NFTPage.module.css";

const NFTPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [offer, setOffer] = useState();
  const [nft, setNft] = useState();
  const [address, setAddress] = useState();
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    getMetadata();
  }, [router.isReady]);

  const getMetadata = async () => {
    const web3 = await initializeWeb3();
    setAddress(web3.accounts[0]);
    console.log(id);
    const _nft = await getFromTokenId(id);
    setNft(_nft);
    const data = await fetch(getIPFS(_nft.tokenURI));
    const json = await data.json();
    setOffer((_nft.price / 10 ** 18).toFixed(2));
    setMetadata(json);
  };

  const handleMakeOffer = async () => {
    await toast.promise(makeOffer(id, offer), {
      pending: "Making offer...",
      success: "Offer made!",
      error: "Error making offer",
    });
    setTimeout(() => {
      getMetadata();
    }, 2000);
  };

  const handleAcceptOffer = async () => {
    await toast.promise(approveOffer(id), {
      pending: "Accepting offer...",
      success: "Offer accepted!",
      error: "Error accepting offer",
    });
    setTimeout(() => {
      getMetadata();
    }, 2000);
  };

  const handleCancelOffer = async () => {
    await toast.promise(cancelOffer(id), {
      pending: "Cancelling offer...",
      success: "Offer cancelled!",
      error: "Error cancelling offer",
    });
    setTimeout(() => {
      getMetadata();
    }, 2000);
  };

  if (!metadata) {
    return <div></div>;
  }
  return (
    <div className={styles.container}>
      <video
        className={styles.video}
        src={getIPFS(metadata.animation_url)}
        autoplay="true"
        muted="muted"
        loop
      />
      <div>
        <div className={styles.title}>{metadata.name}</div>
        <div className={styles.creator}>Created by {nft.owner}</div>
        <p className={styles.description}>{metadata.description}</p>
        <div className={styles.offer}>Minimum Offer: {(nft.price/ 10 ** 18).toFixed(3)} MATIC </div>
        {nft.currentBider != "0x0000000000000000000000000000000000000000" && (
          <div className={styles.offer}>Highest Bidder: {nft.currentBider}</div>
        )}
        {address == nft.owner ? (
          nft.currentBider != "0x0000000000000000000000000000000000000000" ? (
            <>
              <div className={styles.bidplace}>
                <div className={styles.button} onClick={handleAcceptOffer}>
                  Approve
                </div>
                <div className={styles.button} onClick={handleCancelOffer}>
                  Reject
                </div>
              </div>
            </>
          ) : (
            <></>
          )
        ) : address == nft.currentBider ? (
          <div className={styles.bidplace}>
            <div className={styles.button} onClick={handleCancelOffer}>
              Cancel Offer
            </div>
          </div>
        ) : (
          <div className={styles.bidplace}>
            <input
              type={"number"}
              className={styles.amount}
              min={1}
              value={offer}
              onChange={(e) => {
                setOffer(parseFloat(e.currentTarget.value));
              }}
            />
            <div className={styles.button} onClick={handleMakeOffer}>
              Make an Offer
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTPage;
