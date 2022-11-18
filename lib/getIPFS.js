export default (cid) => {
  return `https://nftstorage.link/ipfs/${cid.split("//")[1]}`;
};
