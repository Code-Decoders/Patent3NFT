import getContract from "./getContract";
import getWeb3 from "./getWeb3";

let web3, accounts, contract;

async function initializeWeb3() {
  try {
    const _web3 = await getWeb3();
    const _accounts = await _web3.eth.getAccounts();

    contract = await getContract(_web3);

    accounts = _accounts;
    return { web3, accounts };
  } catch (error) {
    console.error(
      `Failed to load web3, accounts, or contract. Check console for details.`
    );
    console.log(error);
  }
}

const mint = async (ipfs, category) => {
  console.log("Transaction Started");
  try {
    await contract.methods.mint(ipfs, category).send({ from: accounts[0] });
    console.log("Transaction Successfully");
  } catch (error) {
    console.error(error?.data?.message ?? error.message);
  }
};
const makeOffer = async (tokenId, bid) => {
  console.log("Transaction Started");
  try {
    await contract.methods
      .makeOffer(tokenId.toString())
      .send({ from: accounts[0], value: parseInt((bid * 1000000).toString()) });
    console.log("Transaction Successfully");
  } catch (error) {
    console.error(error?.data?.message ?? error.message);
  }
};
const cancelOffer = async (tokenId) => {
  console.log("Transaction Started");
  try {
    await contract.methods
      .cancelOffer(tokenId.toString())
      .send({ from: accounts[0] });
    console.log("Transaction Successfully");
  } catch (error) {
    console.error(error?.data?.message ?? error.message);
  }
};
const approveOffer = async (tokenId) => {
  console.log("Transaction Started");
  try {
    await contract.methods
      .approveOffer(tokenId.toString())
      .send({ from: accounts[0] });
    console.log("Transaction Successfully");
  } catch (error) {
    console.error(error?.data?.message ?? error.message);
  }
};

const getFromCategory = async (category) => {
  console.log("Transaction Started");
  try {
    await contract.methods.getFromCategory(category).call();
    console.log("Transaction Successfully");
  } catch (error) {
    console.error(error?.data?.message ?? error.message);
  }
};
const getFromTokenId = async (id) => {
  console.log("Transaction Started");
  try {
    await contract.methods.getFromTokenId(id.toString()).call();
    console.log("Transaction Successfully");
  } catch (error) {
    console.error(error?.data?.message ?? error.message);
  }
};

export {
  initializeWeb3,
  mint,
  getFromCategory,
  getFromTokenId,
  makeOffer,
  cancelOffer,
  approveOffer,
};
