import { ethers } from "./ethers-5.6.esm.min.js"
import { contractAddress, abi } from "./constants.js"; 

const connectBtn = document.querySelector(".connect-btn"); 
const fundBtn = document.querySelector(".fund__btn");
const balanceBtn = document.querySelector(".balance__btn");
const balanceAmount = document.getElementById("balance__amount");


connectBtn.addEventListener("click", async function connect(){
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
      connectBtn.innerHTML = "Connected"
      const accounts = await ethereum.request({ method: "eth_accounts" })
      console.log(accounts)
    } else {
        connectBtn.innerHTML = "Please install MetaMask"
      }
})

fundBtn.addEventListener("click", async function fund(){
  const ethAmount = document.getElementById("eth-amount").value;
  console.log(`funding with ${ethAmount}`);

  if(typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try{
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTxToBeMined(transactionResponse, provider, ethAmount);
      console.log("done!....yay");
      alert(`You have successfuly funded ${ethAmount} ETH.`);

      // Clearing the input field after the submission
      // ethAmount.value = "";
      
    }catch(error){
      console.log(error);
    }
    
  } else {
    fundBtn.innerHTML = "Please install Metamask!"
  }
})

function listenForTxToBeMined(transactionResponse, provider, ethAmount){
  console.log(`Mining ${transactionResponse.hash} ...`);
  
  return new Promise ((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt)=>{
      console.log(`Completed with ${transactionReceipt.confirmations} confirmations.`);
      resolve()
    })

  })
}

balanceBtn.addEventListener("click", async function getTheBalance (){
  if (typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try{
      const balanceInWei = await provider.getBalance(contractAddress);
      const balanceInEth = ethers.utils.formatEther(balanceInWei)
      console.log(balanceInEth);
      balanceAmount.innerHTML = balanceInEth
    } catch(error){
      console.log(error);
    }
  } else {
    balanceBtn.innerHTML = "Please install Metamask!"
  }
})


