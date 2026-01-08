"use client";
import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from "wagmi";
import { isAddress } from "viem";
import { PinataSDK } from "pinata-web3";
import { CONTRACT_ADDRESS, ABI } from "../constants";

const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiODM3NDdlMS1kYmUwLTRlODYtYmUzNy1mMGYzNjUxNGQ4MjMiLCJlbWFpbCI6InZpc2hhbHJieGIxMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYTg2NTJmZjMzYjE1YTQ3ZDg3ZGMiLCJzY29wZWRLZXlTZWNyZXQiOiI2NWY1MDc4Nzk1MDQ4YjBmMTYzZjc2ZGE0MDE4NTc1MWUwYWVhNGIzYTdiOGZjZTA3MDlkNThkOGQyMTNlNmFhIiwiZXhwIjoxNzk5MzAyMDg4fQ.lNRsiDIeXlKEGJgvRnDLiWPQZTdCO6hinYO-wE-yJWY", // <--- PASTE JWT
  pinataGateway: "gateway.pinata.cloud", 
});

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const { data: owner } = useReadContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'owner' });

  // Form State
  const [studentAddr, setStudentAddr] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => setMounted(true), []);

  async function handleMint() {
    if (!studentName || !courseName || !file || !isAddress(studentAddr)) return alert("Please check all fields.");
    setStatus("🚀 Uploading Assets to IPFS...");

    try {
      const upload = await pinata.upload.file(file);
      const metadata = JSON.stringify({
        name: `${studentName} - ${courseName}`,
        description: `Certified that ${studentName} has completed ${courseName}.`,
        image: `ipfs://${upload.IpfsHash}`,
        attributes: [
            { trait_type: "Student", value: studentName },
            { trait_type: "Course", value: courseName },
            { trait_type: "Date", value: new Date().toLocaleDateString() }
        ]
      });

      // FIX: Use Blob to prevent cidVersion error
      const blob = new Blob([metadata], { type: "application/json" });
      const metaFile = new File([blob], "metadata.json", { type: "application/json" });
      const metaUpload = await pinata.upload.file(metaFile);
      
      setStatus("🔗 Confirming Transaction...");
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'safeMint',
        args: [studentAddr, `ipfs://${metaUpload.IpfsHash}`],
      });
    } catch (e) { console.error(e); setStatus("❌ Error Uploading."); }
  }

  if (!mounted) return null;
  if (!isConnected) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Please Connect Wallet</div>;
  if (owner && address && String(address).toLowerCase() !== String(owner).toLowerCase()) {
    return <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center font-bold text-2xl">⛔ ACCESS DENIED</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="bg-blue-600 p-6">
          <h1 className="text-2xl font-bold">🏛️ Issue Certificate</h1>
          <p className="text-blue-200 text-sm">Securely mint a new academic credential.</p>
        </div>
        
        <div className="p-8 space-y-5">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Student Wallet Address</label>
            <input type="text" placeholder="0x..." className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setStudentAddr(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-400 text-sm mb-2">Student Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setStudentName(e.target.value)} />
            </div>
            <div>
                <label className="block text-gray-400 text-sm mb-2">Course Name</label>
                <input type="text" placeholder="B.Tech AI" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setCourseName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Certificate Image</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:bg-gray-700/50 transition">
                <input type="file" accept="image/*" className="text-sm text-gray-400" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          {status && <div className="text-center text-blue-400 text-sm font-semibold animate-pulse">{status}</div>}

          <button onClick={handleMint} disabled={isPending || !!status && !hash} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition transform hover:-translate-y-1 disabled:opacity-50">
            {isConfirming ? "Minting..." : "Issue Certificate"}
          </button>
          
          {isConfirmed && <div className="p-3 bg-green-500/20 text-green-400 text-center rounded-lg border border-green-500/50">✅ Certificate Issued Successfully!</div>}
        </div>
      </div>
    </div>
  );
}