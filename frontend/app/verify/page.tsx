"use client";
import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "../constants";

export default function VerifyPage() {
  const [tid, setTid] = useState("");
  const [qid, setQid] = useState<bigint | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // 1. Read Token URI from Blockchain
  const { data: uri, isError, isFetching: isContractLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'tokenURI',
    args: qid !== null ? [qid] : undefined,
  });

  // 2. Fetch Data from IPFS (With Race Condition Fix)
  useEffect(() => {
    // If contract is still searching, do nothing
    if (isContractLoading) return;

    // A. If URI found -> Fetch Image
    if (uri) {
      const url = String(uri).replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
      
      fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Not found");
            return res.json();
        })
        .then(data => {
            setMeta(data);
            setLoading(false); // Stop Loading
        })
        .catch(() => {
            setError(true);
            setLoading(false);
        });
    } 
    // B. If Error or No URI (after loading finished) -> Show Error
    else if (isError || (qid !== null && !uri)) {
      setMeta(null);
      setError(true);
      setLoading(false);
    }
  }, [uri, isError, isContractLoading, qid]);

  // 3. Handle Click (The "Reset" Fix)
  function handleVerify() {
    if (!tid) return;
    setMeta(null);   // CLEAR previous result immediately
    setError(false); // CLEAR previous error
    setLoading(true); // START Loading
    setQid(BigInt(tid));
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="z-10 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-center text-white mb-2">Verify Credential</h1>
        <p className="text-center text-slate-400 mb-8">Authenticity Check via Ethereum Sepolia</p>

        {/* Search Bar */}
        <div className="bg-slate-800/50 backdrop-blur-md p-2 rounded-2xl border border-slate-700 flex shadow-xl mb-10">
          <input 
            type="number" 
            placeholder="Enter Token ID (e.g. 0)" 
            className="flex-1 bg-transparent p-4 text-white text-lg outline-none placeholder-slate-500"
            onChange={e => setTid(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          />
          <button 
            onClick={handleVerify}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Checking..." : "Verify"}
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
            <div className="text-center text-blue-400 animate-pulse font-semibold">
                📡 Scanning Blockchain...
            </div>
        )}

        {/* SUCCESS RESULT */}
        {!loading && meta && (
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-green-500/30 animate-fade-in-up">
            
            {/* Valid Badge */}
            <div className="bg-green-500/10 p-4 flex items-center justify-center gap-2 border-b border-green-500/20">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✓</div>
                <span className="text-green-400 font-bold tracking-wide">OFFICIALLY VERIFIED</span>
            </div>

            {/* Image */}
            <div className="p-6 bg-slate-900/50">
                <img 
                    src={meta.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")} 
                    className="w-full rounded-lg shadow-lg border border-slate-700"
                    alt="Certificate"
                />
            </div>

            {/* Details */}
            <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{meta.name}</h2>
                <p className="text-slate-400 text-sm mb-4">{meta.description}</p>
                
                <div className="grid grid-cols-2 gap-3">
                    {meta.attributes?.map((attr: any, i: number) => (
                        <div key={i} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{attr.trait_type}</p>
                            <p className="text-white font-medium">{attr.value}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
            <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-center backdrop-blur-md animate-shake">
                <div className="text-4xl mb-2">❌</div>
                <h3 className="text-red-400 font-bold text-lg">Invalid Certificate ID</h3>
                <p className="text-red-300/80 text-sm mt-1">
                    No academic record found for Token ID #{String(qid)}.
                </p>
            </div>
        )}

      </div>
    </div>
  );
}