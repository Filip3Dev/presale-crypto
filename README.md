# CLTS Presale

This is a dApp for the presale of CLTS tokens. The pre-sale runs in 24-hour stages and this app lets you purchase tokens as per the price of the current stage. The app runs on the Polygon Mumbai chain

The application is hosted here:
[Vercel Link](https://tstk-beincrypto.vercel.app/)

## Key Decisions and assumptions

1. Users can buy a maximum of 10,000 tokens per stage. This limit is enforced from this app to avoid unnecessary calls to the contract.
2. Since the app is working on a testnet (Polygon Mumbai), the assumption is that gas fees are negligible, and users don't need to worry about high transaction costs.
3. The app does not require user authentication, and users can interact with it using their wallets directly.
5. The stage countdown component assumes that each stage will take exactly 24 hours. However, the time between blocks on Polygon Mumbai fluctuates and is not always 2 seconds which means it can sometimes take less or more than 24 hours per stage.
6. Since the presale smart contract has an unlimited number of stages, it is assumed that the stage progressions are managed internally within the smart contract. 
7. The ERC-20 token contract is already deployed on Polygon testnet. It is assumed that this contract is correctly deployed and functioning properly. A similar assumption is made for the Presale contract.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- Yarn or npm (This guide will use Yarn)

### Installation

1. Clone this repository:

```bash
git https://github.com/jillo-abdullahi/tstk-beincrypto.git
```

2. Navigate into the project directory:

```bash
cd tstk-beincrypto
```

3. Install the dependencies:

```bash
yarn
```
4. Create a `.env` file and add the following values. You'll need an Alchemy API key as well as your walletConnect project key. 
```
NEXT_PUBLIC_ALCHEMY_ID=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_CLTS_TOKEN_ADDRESS=
NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS=
```

To obtain an Alchemy key head over to [the Alchemy website](https://alchemy.com/).
For the Wallet project key, you'll need to create a free project [here](https://cloud.walletconnect.com/sign-in) and get your key from the project dashboard.

### Running the Application

Start the application in development mode:

```bash
yarn dev
```

Then open http://localhost:3000 with your web browser to see the result.

### Testing the Application

The app has tests written using the Jest library:

```bash
yarn jest
```

### Deployment

To create an optimized production build:

```bash
yarn build
```

You can then serve the built application with `yarn start`.

```bash
yarn start
```

## Built With

- [Next.js](https://nextjs.org/) - The React Framework
- [ConnectKit](https://docs.family.co/connectkit) - For blockchain wallet connections.
- [Wagmi](https://wagmi.sh/) - For smart contract calls.
- [TypeScript](https://www.typescriptlang.org/) - Used for static typing
- [Mantine ](https://mantine.dev/) - UI components library.

