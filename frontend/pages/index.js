import React, {useState, useRef} from "react";
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
}

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
        const signer = await getProviderOrSigner();
          // We will get the signer now to extract the address of the currently connected MetaMask account
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
        
      }
    }
