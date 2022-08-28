import { ethers } from "./ethers-5.6.esm.min.js"
import { contractAddress, abi } from "./constants.js"; 

const connectBtn = document.querySelector(".connect-btn");

// Getting fund html elements ====================================
const fundBtn = document.querySelector(".fund__btn");
const ethAmountToFund = document.getElementById("eth-amount__fund")
const fundWrittenAlert = document.querySelector(".fund__written--alert")

// Getting balance html elements =================================
const balanceBtn = document.querySelector(".balance__btn");
const balanceAmount = document.getElementById("balance__amount");
const balanceWrittenAlert = document.querySelector(".balance__written--alert")

// Getting withdraw html elements ==================================
const withdrawBtn = document.querySelector(".withdraw__btn");
const ethAmountToWithdraw = document.getElementById("eth-amount__withdraw")
const withdrawWrittenAlert = document.querySelector(".withdraw__written--alert")



// Conncet to metamask function =====================================
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
        alert("PLease Install Metamask!");
        connectBtn.innerHTML = "Please install MetaMask"
      }
})

// Fund function ======================================================
fundBtn.addEventListener("click", async function fund(){
  const ethAmountToFundValue =  ethAmountToFund.value;
  console.log(`funding with ${ethAmountToFundValue}`);

  if(typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try{
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmountToFundValue),
      })
      await listenForTxToBeMined(transactionResponse, provider);
      console.log("done!....yay");
      alert(`You have successfuly funded ${ethAmountToFundValue} ETH.`);

      // Clearing the input field after the submission
      // ethAmountToFundValue.value = "";
      
    }catch(error){
      console.log(error);
    }
    
  } else {
    fundWrittenAlert.innerHTML = "Please install Metamask!"
  }
})

// Wait for transaction to be mined function =============================================
function listenForTxToBeMined(transactionResponse, provider){
  console.log(`Mining ${transactionResponse.hash} ...`);
  
  return new Promise ((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt)=>{
      console.log(`Completed with ${transactionReceipt.confirmations} confirmations.`);
      resolve()
    })

  })
}


// Balance function ==========================================================
balanceBtn.addEventListener("click", async function getTheBalance (){
  if (typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try{
      const balanceInWei = await provider.getBalance(contractAddress);
      const balanceInEth = ethers.utils.formatEther(balanceInWei)
      console.log( `The current balance is ${balanceInEth} ETH!`);
      balanceAmount.innerHTML = balanceInEth
    } catch(error){
      console.log(error);
    }
  } else {
    balanceWrittenAlert.innerHTML = "Please install Metamask!"
  }
})


// Withdraw function ======================================================================
withdrawBtn.addEventListener("click", async function withdraw(){
  const ethAmountToWithdrawValue = ethAmountToWithdraw.value
  console.log(`Withdrawing ${ethAmountToWithdrawValue} ETH`);
  
  if (typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress,abi , signer);
    
    try{
     
      const transactionResponse = await contract.withdraw({
        value: ethers.utils.parseEther(ethAmountToWithdrawValue)
      });
      await listenForTxToBeMined(transactionResponse, provider);
      console.log("done!....yay");
      alert(`You have successfuly withdrawn ${ethAmountToWithdrawValue} ETH.`);
    } catch (error) {
      console.log(error)
    }
  } else {
    withdrawWrittenAlert.innerHTML = "Please install Metamask!"
  } 
})
