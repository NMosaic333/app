import { BrowserProvider, Contract } from "ethers";

const contractAddress = "0xF551026512142d5c95E32f84D7Ee54aEf3eBeB9C";
const ABI = [
  {
    inputs: [{ internalType: "string", name: "_certificateHash", type: "string" }],
    name: "storeCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "certificates",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "string", name: "_certificateHash", type: "string" },
    ],
    name: "verifyCertificate",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

let provider = null;
let signer = null;
let contract = null;

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not found");

  provider = new BrowserProvider(window.ethereum);

  // Check current network
  const network = await provider.getNetwork();
  if (network.chainId !== 11155111n) {
    // Ask MetaMask to switch network
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // Sepolia
    });

    // Wait a little for MetaMask to apply
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Request accounts
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contract = new Contract(contractAddress, ABI, signer);

  const address = await signer.getAddress();
  return { address };
}

export function isWalletConnected() {
  return !!signer && !!contract;
}

export async function generateFileHash(file) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export async function storeCertificate(hash) {
  if (!contract) throw new Error("Connect wallet first");
  const tx = await contract.storeCertificate(hash);
  await tx.wait();
  return true;
}

export async function verifyCertificate(addr, hash) {
  if (!contract) throw new Error("Connect wallet first");
  return await contract.verifyCertificate(addr, hash);
}

export async function readStoredHash(addr) {
  if (!contract) throw new Error("Connect wallet first");
  return await contract.certificates(addr);
}
