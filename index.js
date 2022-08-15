import { ethers } from "./ethers-5.6.esm.min.js"

const connectBtn = document.querySelector(".connect-btn"); 
const fundBtn = document.querySelector(".fund__btn");


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
  if(typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);
    
  }
 })

