import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";
import logo from "./logo.png";
import DonationABI from "./Donation.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Navbar, Nav, Container } from 'react-bootstrap';

function App() {
  const [amount, setAmount] = useState(0);
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [donationSuccessful, setDonationSuccessful] = useState(false);
  const [contractBalanceInUSD, setContractBalanceInUSD] = useState(0);

  useEffect(() => {
    initializeContract();
  }, []);

  const initializeContract = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DonationABI.networks[networkId];
      const contractAddress = "0x0D7f4A343100DCdBfa838223Ab3744c86FC2dDe3";
      const donationContract = new web3.eth.Contract(DonationABI.abi, contractAddress);
      setContract(donationContract);
      await loadContractData();
    } catch (error) {
      console.error("Failed to initialize contract:", error);
    }
  };

  const loadContractData = async () => {
    try {
      const contractBalance = await contract.methods.getContractBalance().call();
      const transactions = await contract.getPastEvents("DonationReceived", {
        fromBlock: 0,
        toBlock: "latest",
      });
      const balanceInEth = Web3.utils.fromWei(contractBalance, "ether");
      const formattedTransactions = transactions
        .slice(Math.max(transactions.length - 5, 0))
        .reverse()
        .map((transaction) => ({
          donor: transaction.returnValues.donor,
          amount: Web3.utils.fromWei(transaction.returnValues.amount, "ether"),
        }));
      setContractBalance(balanceInEth);
      setTransactions(formattedTransactions);
      await loadContractBalanceInUSD();
    } catch (error) {
      console.error("Failed to load contract data:", error);
    }
  };

  const loadContractBalanceInUSD = async () => {
    try {
      const contractBalanceInUSD = await contract.methods.getContractBalanceInUSD().call();
      const x =contractBalanceInUSD/1e18;
      setContractBalanceInUSD(x);
    } catch (error) {
      console.error("Failed to load contract balance in USD:", error);
    }
  };

  const handleDonate = async () => {
    if (window.ethereum) {
      try {
        window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const weiAmount = web3.utils.toWei(amount.toString(), "ether");
        if (amount !== 0) {
          await contract.methods.donate().send({
            from: accounts[0],
            value: weiAmount,
          });
          await loadContractData(); // Refresh contract data after donation
          setDonationSuccessful(true);
        } else {
          alert("Amount entered is empty");
        }
      } catch (error) {
        console.error("Failed to donate:", error);
      }
    } else {
      console.error("Metamask not detected!");
      alert("Metamask not installed!");
    }
  };

  return (
    <>
      <Navbar bg='success' variant="dark" expand="lg">
        <Container>
          <img src={logo} className="logo"></img>
          <Navbar.Brand href="#">donation-DApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav" className="justify-content-end">
            <Nav className="ml-auto">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="https://sepolia.etherscan.io/address/0x0D7f4A343100DCdBfa838223Ab3744c86FC2dDe3">Etherscan#</Nav.Link>
              <Nav.Link href="#cont">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container2">
        <div className="row">
          <div className="col2">
            <p className="text-center2"><i>"It's not how much we give but</i> </p>
            <p className="text-center2"><i>how much love we put into giving."</i></p>
            <p className="text-centerMT">- Mother Teresa</p>
          </div>
        </div>
      </div>

      <div className="container3">
        <h2 className="text-center3"><b>SAVE A CHILD !</b></h2>
        <div className="row">
          <div className="col">
            <p className="text-center3">Welcome to the Donation-DApp, where you donate <b>Ethereum (ETH)</b> directly to our smart contract to support various causes, from medical assistance to education and disaster relief for <b>children in need.</b></p>
            <p className="text-center3">We are Transparent: Track the charity fund balance in real-time. Discover the recent transactions on-site or view the full transactions on Etherscan. Start donating today and save lives.</p>
            <p className="text-center3">Thank you for being part of TheDonation-dApp community!<br></br></p>
          </div>
        </div>
      </div>

      <div id="d">
        <div className="row">
          <div className="col-md-6">
            <p className="enter">Enter the amount you wish to donate in <b>Ethereum</b></p>
            <input
              type="number"
              className="form-control"
              placeholder="ETH"
              onChange={(e) => setAmount(e.target.value)}
            /><br></br>
            <button className="button" onClick={handleDonate}>Donate<br></br></button>
            {donationSuccessful && (<p className="message"><br></br>Donation was successful. Thank you!!</p>)}
          </div>
        </div>
        <div className="container5">
          <div>
            <p className="make"><br></br><br></br>*make any donation to view charity balance and previous history<br></br></p>
            <h4 className="bal" ><br></br>
              Donation Funds Balance:&nbsp;
              <p4 className="balance">{contractBalance}</p4>&nbsp;
              <p4>ETH <br></br><br></br>≈ <p5 className="balance"> {contractBalanceInUSD}</p5> USD</p4>
            </h4>
            
          </div>
          <div className="col-md-6">
            <h5 className="trans">Last Transactions:</h5>
            <ul1>
              {transactions.map((transaction, index) => (
                <li key={index}>
                  Donor: {transaction.donor}
                  <br />
                  Amount: {transaction.amount} ETH
                </li>
              ))}
            </ul1>
          </div>
        </div>
      </div>

      <div id="cont">
      <ul ><h4 id="h4">Nishil</h4>
          <a href="https://twitter.com/Nish0483" target="_blank"><i class="fa fa-twitter" style={{ fontSize: "16px" }}></i></a>
         <a href="https://www.linkedin.com/in/nishil-a-05a3a6137/" target="_blank"><i class="fa fa-linkedin" style={{ fontSize: "16px" }}></i></a>
          <a href="https://www.instagram.com/nishil__/" target="_blank"><i class="fa fa-instagram" style={{ fontSize: "16px" }}></i></a>
          <a href="https://github.com/Nish0483" target="_blank"><i class="fa fa-github" style={{ fontSize: "16px" }}></i></a>
      </ul>
    </div>

      
    </>
  );
}

export default App;
