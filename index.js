import { ethers } from "./ethers-5.2.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;

const fundButton = document.getElementById("fundButton");
fundButton.onclick = fund;

const balanceButton = document.getElementById("balanceButton");
balanceButton.onclick = getBanlance;

const withdrawButton = document.getElementById("withdrawButton");
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected";
  } else {
    connectButton.innerHTML = "Plz  apply metamask!!";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log("hi this is fund");
  console.log(`fund ${ethAmount} eth now`);
  if (typeof window.ethereum !== "undefined") {
    //provider 这个已经连接上钱包的网页
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //利用provider拿到 此provider 的钱包签名
    const signer = provider.getSigner();
    //万事俱备现在可以去创建合约对象调用合约内的方法了
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transaction = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      //在交易结束后 给用户一点提示
      await listenForTransactionMine(transaction, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  //在交易hash出席先后，出发函数 打印 确认了几个区块，作为交易已经完成的提示
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `completed with ${transactionReceipt.confirmations} confirmation`
      );
      resolve();
    });
  });
}

async function getBanlance() {
  if (typeof window.ethereum !== "undefined") {
    //provider 这个已经连接上钱包的网页
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

//withdraw
async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    //provider 这个已经连接上钱包的网页
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //利用provider拿到 此provider 的钱包签名
    const signer = provider.getSigner();
    //万事俱备现在可以去创建合约对象调用合约内的方法了
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
//fund function
