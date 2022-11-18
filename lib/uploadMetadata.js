import { NFTStorage } from 'nft.storage'
const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ3MDk4OWIzN2JlMjExN2QwYWE2MGRCNmYyMzIzODQ5NTQzMjNiRDYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNjA4NzY0NTU5NSwibmFtZSI6InRlc3QifQ.CSD7bSQgXEzLIP8eTKxqJLYYmVEHulNdIoMHgGUCn5c"

export const uploadMetadata = async (
  title,
  category,
  description,
  image,
  video
) => {
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })
    console.log(typeof image);
    console.log(image)
    const imageFile = await fetch(image)
      .then((res) => res.blob())
      .then((blob) => new File([blob], "thumbnail.png", { type: "image/png" }));
    const imageCid = await nftstorage.storeBlob(imageFile)

  const videoCid = await  nftstorage.storeBlob(video);
  const json = {
    name: title,
    description: description,
    image: "ipfs://"+imageCid,
    animation_url: "ipfs://"+videoCid,
    attributes: [
      {
        trait_type: "category",
        value: category,
      },
    ],
  };
  const file = new File([JSON.stringify(json)], "metadata.json");
  const cid = await nftstorage.storeBlob(file);
  console.log(cid);
  return cid;
};
