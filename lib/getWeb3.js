import Web3 from 'web3'

const resolveWeb3 = (resolve) => {
    let { web3 } = window
    const alreadyInjected = typeof web3 !== 'undefined' // i.e. Mist/Metamask
    const localProvider = `https://morning-alpha-choice.matic-testnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_API}/`
    // const localProvider = `https://rpc-mumbai.maticvigil.com/`
    if (alreadyInjected) {
        console.log(`Injected web3 detected.`)
        web3 = new Web3(web3.currentProvider)
        console.log(web3)    
    } else {
        console.log(`No web3 instance injected, using Local web3.`)
        const provider = new Web3.providers.HttpProvider(localProvider)
        web3 = new Web3(provider)
    }


    window.ethereum.request({ method: 'eth_requestAccounts' })

    window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(80001) }]
    });



    resolve(web3)
}

export default () =>
    new Promise((resolve) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener(`load`, () => {
            resolveWeb3(resolve)

        })
        // If document has loaded already, try to get Web3 immediately.
        if (document.readyState === `complete`) {
            resolveWeb3(resolve)
        }
    })