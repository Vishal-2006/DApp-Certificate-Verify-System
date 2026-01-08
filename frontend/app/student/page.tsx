"use client";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit'; // <--- Added this
import { CONTRACT_ADDRESS, ABI } from "../constants";

export default function StudentPage() {
  const { address, isConnected } = useAccount();

  // 1. DISCONNECTED STATE (The fix for your screen)
  if (!isConnected) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-5">
      <div className="bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700 text-center max-w-md w-full">
        <div className="text-5xl mb-6">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-2">Student Portal</h1>
        <p className="text-slate-400 mb-8">Connect your wallet to view your academic credentials.</p>
        
        {/* This creates the center button you need */}
        <div className="flex justify-center">
          <ConnectButton label="Login with Wallet" />
        </div>
      </div>
    </div>
  );

  // 2. CONNECTED STATE (Dashboard)
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-purple-600 pl-4">
            My Certificates
          </h1>
          <ConnectButton />
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2, 3, 4, 5].map((id) => (
            <CertificateCard key={id} tokenId={BigInt(id)} userWallet={address} />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENT (Same as before) ---
function CertificateCard({ tokenId, userWallet }: any) {
  const [meta, setMeta] = useState<any>(null);
  const { data: owner } = useReadContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'ownerOf', args: [tokenId] });
  const { data: uri } = useReadContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'tokenURI', args: [tokenId] });

  useEffect(() => {
    if (owner && userWallet && String(owner).toLowerCase() === String(userWallet).toLowerCase() && uri) {
      const url = String(uri).replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
      if (url.includes("QmTest")) return; 
      
      fetch(url)
        .then(res => res.ok ? res.json() : null)
        .then(setMeta)
        .catch(err => console.log("Skipping invalid metadata"));
    }
  }, [owner, uri, userWallet]);

  if (!meta) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden border border-gray-100 animate-fade-in-up">
      <div className="h-56 bg-gray-200 relative">
        <img src={meta.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")} alt="Cert" className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
          #{String(tokenId)}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{meta.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{meta.description}</p>
        <div className="flex flex-wrap gap-2">
            {meta.attributes?.map((attr: any, i: number) => (
                <span key={i} className="bg-purple-50 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
                    {attr.value}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
}