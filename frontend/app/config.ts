import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi'; 

export const config = getDefaultConfig({
  appName: 'Certificate Verifier',
  projectId: 'YOUR_PROJECT_ID', // Leave this as is
  chains: [sepolia],
  transports: {
    [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/usd4RijlRMRNNY3Xm38rg"), 
  },
  ssr: true,
});