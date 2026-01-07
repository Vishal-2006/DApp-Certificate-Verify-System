# DApp-Certificate

This project is a decentralized application for issuing and verifying academic certificates as Soul-Bound Tokens (SBTs) on the blockchain.

## Project Structure

-   `/contract`: Contains the Hardhat project with the Solidity smart contract for the Academic SBT.
-   `/frontend`: Contains the Next.js application that provides the user interface for interacting with the smart contract.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [MetaMask](https://metamask.io/) browser extension
-   A text editor (e.g., [VS Code](https://code.visualstudio.com/))
-   [Git](https://git-scm.com/) and [Git Bash](https://gitforwindows.org/) (on Windows)

### 1. Contract Deployment

1.  **Navigate to the contract directory:**
    ```bash
    cd contract
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `contract` directory and add the following environment variables. You can get a Sepolia RPC URL from a service like [Alchemy](https://www.alchemy.com/).
    ```
    SEPOLIA_RPC_URL="YOUR_SEPOLIA_RPC_URL"
    PRIVATE_KEY="YOUR_METAMASK_PRIVATE_KEY"
    ```

4.  **Compile the contract:**
    ```bash
    npx hardhat compile
    ```

5.  **Deploy the contract to the Sepolia testnet:**
    ```bash
    npx hardhat run scripts/deploy.js --network sepolia
    ```
    After deployment, copy the contract address printed in the console.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Update Contract Address:**
    Open `frontend/app/constants.ts` and replace `"YOUR_CONTRACT_ADDRESS"` with the address of your deployed contract.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
