import { useEffect, useState } from "react";
import "./App.css";
import contract from "../contracts/currencyConverter.json";
import "./CurrencyConverter.css";
import { ethers } from "ethers";

const contractAddress = "0xA5012d8C51aE270Cb972FEc4875522E6cDE844E7";
const abi = contract.abi;
const currencyConverterAddress: { [key: string]: string } = {
  "LINK/USD": "0xc59E3633BAAC79493d908e63626716e204A45EdF",
  "BTC/USD": "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
  "ETH/USD": "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  "BTC/ETH": "0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22",
};
function App() {
  const [selectedPair, setSelectedPair] = useState("");
  const [fetchConversion, setFetchConversion] = useState(false);
  const [price, setPrice] = useState(0);

  const handleSubmit = async () => {
    // Here you would integrate with ethers.js and your smart contract
    if (!selectedPair) {
      alert("Please select a currency pair to convert");
      return;
    }
    setFetchConversion(true);
    console.log(`Selected currency pair for conversion: ${selectedPair}`);
    // Fetch conversion rate using ethers.js
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const currencyConverterContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );

        // alert("Initialize payment");
        const price = await currencyConverterContract.getLatestPrice(
          currencyConverterAddress[selectedPair]
        );
        console.log(`Conversion rate: ${price}`);
        setPrice(price.toString().slice(0, -8));
      }
    } catch (err) {
      console.log(err);

      setFetchConversion(false);
      alert("Error fetching conversion rate");
      return;
    }
  };
  const [walletAddress, setWalletAddress] = useState("");

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setWalletAddress(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <div>
        <button
          onClick={connectWalletHandler}
          className="cta-button connect-wallet-button"
        >
          Connect Wallet
        </button>
      </div>
    );
  };
  useEffect(() => {
    checkWalletIsConnected();
  }, [walletAddress]);

  const returnConversionRate = (pair: string): string => {
    switch (pair) {
      case "LINK/USD":
        return `1 LINK = ${price} USD`;
      case "BTC/USD":
        return `1 BTC = ${price} USD`;
      case "ETH/USD":
        return `1 ETH = ${price} USD`;
      case "BTC/ETH":
        return `1 BTC = ${price} ETH`;
      default:
        return "";
    }
  };

  const chainlinkUIConversion = (): React.ReactNode => {
    return (
      <div className="currency-converter">
        <form>
          <label>
            <input
              type="radio"
              name="pair"
              value="BTC/USD"
              onChange={(e) => setSelectedPair(e.target.value)}
            />
            BTC / USD
          </label>
          <label>
            <input
              type="radio"
              name="pair"
              value="ETH/USD"
              onChange={(e) => setSelectedPair(e.target.value)}
            />
            ETH / USD
          </label>
          <label>
            <input
              type="radio"
              name="pair"
              value="LINK/USD"
              onChange={(e) => setSelectedPair(e.target.value)}
            />
            LINK / USD
          </label>
          <label>
            <input
              type="radio"
              name="pair"
              value="BTC/ETH"
              onChange={(e) => setSelectedPair(e.target.value)}
            />
            BTC / ETH
          </label>
          <button type="button" onClick={handleSubmit}>
            GET CONVERSION RATE
          </button>
        </form>
        {fetchConversion &&
          (price != 0 ? (
            <div className="conversion-result">
              {returnConversionRate(selectedPair)}
            </div>
          ) : (
            <div className="conversion-result">Fetching price ...</div>
          ))}
      </div>
    );
  };

  return (
    <div className="currency-converter">
      <h2>CHAINLINK PAIR CONVERSION</h2>
      {walletAddress === "" ? connectWalletButton() : chainlinkUIConversion()}
    </div>
  );
}

export default App;
