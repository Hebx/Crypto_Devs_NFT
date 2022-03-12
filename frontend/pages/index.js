import React, {useState, useRef, useEffect  } from "react";
import Head from "next/head";
import {Contract, providers, utils} from "ethers";
import Web3Modal from "web3modal";
import {abi , NFT_CONTRACT_ADDRESS} from "../constants";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState('0');
  const web3ModalRef = useRef();


const presaleMint = async () => {
  try {
    const signer = await getProviderOrSigner(true);
    // create a new instance of the contract with a signer which allow update methods
    const whitelistContract = new Contract(
      NFT_CONTRACT_ADDRESS,
      abi,
      signer
    );
// call the presaleMint from the contract only whitelisted addresses will be able to mint
const tx = await whitelistContract.presaleMint({
  value: utils.parseEther("0.01"),
});
setLoading(true);
await tx.wait();
setLoading(false);
alert("You successfully minted a CryptoDev");
  } catch (err) {
    console.error(err);
  }
};

const publicMint = async () => {
  try {
    const signer = await getProviderOrSigner(true);
    // create a new instance of the contract with a signer which allow update methods
    const whitelistContract = new Contract(
      NFT_CONTRACT_ADDRESS,
      abi,
      signer
    );
// call the presaleMint from the contract only whitelisted addresses will be able to mint
const tx = await whitelistContract.mint({
  value: utils.parseEther("0.01"),
});
setLoading(true);
await tx.wait();
setLoading(false);
alert("You successfully minted a CryptoDev");
  } catch (err) {
    console.error(err);
  }
};

const connectWallet = async () => {
  try {
    // get the provider from web3modal which in our case is Metamask
    await getProviderOrSigner();
    setWalletConnected(true);
  } catch (err) {
    console.error(err);
  }
}

const startPresale = async () => {
  try {
    const signer = await getProviderOrSigner(true);
    // create a new instance of the contract with a signer which allow update methods
    const whitelistContract = new Contract(
      NFT_CONTRACT_ADDRESS,
      abi,
      signer
    );
// call the presaleMint from the contract only whitelisted addresses will be able to mint
const tx = await whitelistContract.startPresale();
setLoading(true);
await tx.wait();
setLoading(false);
await checkIfPresaleStarted();
  } catch (err) {
    console.error(err);
  }
};

  /**
   * checkIfPresaleStarted: checks if the presale has started by quering the `presaleStarted`
   * variable in the contract
   */

  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner();
      // connected to the contract using provider ( read-only access )
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      // call the presaleStarted from the contract
      const _presaleStarted = await nftContract.presaleStarted();
      if (!_presaleStarted) {
        await getOwner();
      }
      setPresaleStarted(_presaleStarted);
      return _presaleStarted;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

    /**
   * checkIfPresaleEnded checks if the presale has ended by quering the `presaleEnded`
   * variable in the contract
   */

    const checkIfPresaleEnded = async () => {
      try {
        const provider = await getProviderOrSigner();
        // connected to the contract using provider ( read-only access )
        const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
        // call the presaleStarted from the contract
        const _presaleEnded = await nftContract.presaleEnded();
        // _presaleEnded is a Big Number, so we are using the lt(less than function) insteal of `<`
      // Date.now()/1000 returns the current time in seconds
      // We compare if the _presaleEnded timestamp is less than the current time
      // which means presale has ended
      const hadEnded = _presaleEnded.It(Math.floor(Date.now() / 1000));
      if (hasEnded) {
        setPresaleEnded(true);
      } else {
        setPresaleEnded(false);
      }
      return hasEnded;
      } catch (err) {
        console.error(err);
      }
    }

    const getOwner = async () => {
      try {
        const provider = await getProviderOrSigner();
        const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
              // call the owner function from the contract
        const _owner = await nftContract.owner();
          // We will get the signer now to extract the address of the currently connected MetaMask account
        const signer = await getProviderOrSigner(true);
        // Get the address associated to the signer which is connected to  MetaMask
        const address = await signer.getAddress();
        if (address.toLowerCase() === _owner.toLowerCase()) {
          setIsOwner(true);
        }
      } catch (err) {
        console.error(err);
      }
    }

    const getTokenIdsMinted = async () => {
      try {
        const provider = await getProviderOrSigner();
        const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
        const _tokenIds = await nftContract.tokenIds();
        // _tokenIds is a BigNumber we need to convert it to a string
        setTokenIdsMinted(_tokenIds.toString());
      } catch (err) {
        console.error(err);
      }
    }

      /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
    const getProviderOrSigner = async (needSigner = false) => {
      // connnect to metamask
      // since we store "web3modal" as a reference we need to access the `current`v value to get access to the underlying object
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const {chainId} = await web3Provider.getNetwork();
      if (chainId !== 4) {
        window.alert("change the network to rinkeby");
        throw new Error("change network to rinkeby");
      }
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    }

    useEffect(() => {
      if (!walletConnected)
      {
          // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
        // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
        web3ModalRef.current = new Web3Modal({
          network: "rinkeby",
          providerOptions: {},
          disableInjectedProvider: false,
        });
        connectWallet();
      // check if presale has started and ended
      const _presaleStarted = checkIfPresaleStarted();
      if (_presaleStarted) {
        checkIfPresaleEnded();
      }
      getTokenIdsMinted();
      // set an interval for every 5 seconds to check presale ended
      const presaleEndedInterval = setInterval(async function () {
        const _presaleStarted = await checkIfPresaleStarted();
        if (_presaleStarted) {
          const _presaleEnded = checkIfPresaleEnded();
          if (_presaleEnded) {
            clearInterval(presaleEndedInterval);
          }
        }
      }, 5 * 1000);

      // set interval to get number of tokenIds minted every 5 seconds
      setInterval(async function () {
        await getTokenIdsMinted();
      }, 5 * 1000);
    }
    }, [walletConnected]);

    const renderButton = () => {
      if (!walletConnected) {
        return (
          <button onClick={connectWallet} className={styles.button}>
            Connect you wallet
          </button>
        );
      }
      if (loading) {
        return <button className={styles.button}>Loading...</button>
      }
      // if connected user is the owner and presale hasnt started yet allow them to start the presale
      if (isOwner && !presaleStarted) {
        return (
          <button className={styles.button} onClick={startPresale}>
            Start Presale!
          </button>
        )
      }
      // if connected user is not the owner and presale hasnt started yet let them know
      if (!presaleStarted) {
        return (
          <div>
            <div className={styles.description}>Presale hasn't started yet!</div>
          </div>
        )
      }
      // if presale started but hasnt ended yet allow for minting during the presale period
      if (presaleStarted && !presaleEnded)
      {
        return (
          <div>
            <div className={styles.description}>
              Presale has started! if your address is whitelisted, Mint a Crypto Dev ⌬
            </div>
            <button className={styles.button} onClick={presaleMint}>
              Presale Mint ⏣
            </button>
          </div>
        )
      }
      // If Presale started and ended its time for public mint
      if (presaleStarted && presaleEnded)
      {
        return (
          <button className={styles.button} onClick={publicMint}>
            Public Mint ⏣
          </button>
        )
      }
    }
    return (
      <div>
        <Head>
          <title>Crypto Devs</title>
          <meta name="description" content="Whitelist-Dapp" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
          <div>
            <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
            <div className={styles.description}>
              Its an NFT collection for developers in Crypto.
            </div>
            <div className={styles.description}>
              {tokenIdsMinted}/20 have been minted
            </div>
            {renderButton()}
          </div>
          <div>
            <img className={styles.image} src="./cryptodevs/0.svg" />
          </div>
        </div>

        <footer className={styles.footer}>
          Made with &#10084; by Crypto Devs
        </footer>
      </div>
    );
  }
