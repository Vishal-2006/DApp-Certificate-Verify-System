import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Header */}
      <div className="z-10 text-center mb-16 max-w-2xl px-4">
        <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          CertifiChain
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          The future of academic credentials. Issue, Store, and Verify degrees on the Blockchain.
        </p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
      </div>

      {/* The 3 Roles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4 z-10">
        
        {/* Admin Card */}
        <Link href="/admin">
          <div className="group bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-2xl hover:border-blue-500 hover:bg-slate-800/80 transition-all cursor-pointer h-full">
            <div className="bg-blue-500/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition">
              🏛️
            </div>
            <h2 className="text-2xl font-bold mb-3">College Admin</h2>
            <p className="text-slate-400 text-sm">Restricted Access. Issue new tamper-proof certificates to students.</p>
          </div>
        </Link>

        {/* Student Card */}
        <Link href="/student">
          <div className="group bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-2xl hover:border-purple-500 hover:bg-slate-800/80 transition-all cursor-pointer h-full">
            <div className="bg-purple-500/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition">
              🎓
            </div>
            <h2 className="text-2xl font-bold mb-3">Student Portal</h2>
            <p className="text-slate-400 text-sm">View your digital degrees and download your academic assets.</p>
          </div>
        </Link>

        {/* Verify Card */}
        <Link href="/verify">
          <div className="group bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-2xl hover:border-green-500 hover:bg-slate-800/80 transition-all cursor-pointer h-full">
            <div className="bg-green-500/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition">
              🔍
            </div>
            <h2 className="text-2xl font-bold mb-3">Public Verify</h2>
            <p className="text-slate-400 text-sm">Instant verification for employers and third parties.</p>
          </div>
        </Link>

      </div>
    </div>
  );
}