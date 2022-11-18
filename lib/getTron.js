const TronWeb = require("tronweb");

const resolveTron = (resolve) => {
  let { tronWeb } = window;
  const alreadyInjected = typeof tronWeb !== "undefined"; // i.e. Mist/Metamask
  window.tronLink.request({method: 'tron_requestAccounts'})
  if (alreadyInjected) {
      console.log(`Injected tron detected.`);
      console.log(tronWeb);
    } else {
        console.log(`No tron instance injected, using Custom Tron provider.`);
        const fullNode = "https://api.shasta.trongrid.io";
        const solidityNode = "https://api.shasta.trongrid.io";
        const eventServer = "https://api.shasta.trongrid.io";
        const privateKey = process.env.TRON_PRIVATE_KEY;
        tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    }


  resolve(tronWeb);
};

export default () =>
  new Promise((resolve) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      resolveTron(resolve);
    });
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === `complete`) {
      resolveTron(resolve);
    }
  });
