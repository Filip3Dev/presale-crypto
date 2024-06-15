import { useAccount, useContractRead } from 'wagmi';
import { ABI } from '@/contract/FaucetContractABI';

export interface IFaucetData {
  isFaucetOpen: boolean;
  nextClaimTime: string;
  stageMaxTokens: string;
  mintedTokensCount: string;
}

const useGetFaucetData = (): IFaucetData => {
  const { address } = useAccount();

  const { data: faucetOpen } = useContractRead({
    abi: ABI,
    address: process.env.NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS as `0x${string}` | undefined,
    functionName: 'isFaucetOpen',
    watch: false,
  });

  const { data: claimTime } = useContractRead({
    abi: ABI,
    address: process.env.NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS as `0x${string}` | undefined,
    functionName: 'nextClaimTime',
    args: [address],
    watch: true,
  });

  const { data: stageMax } = useContractRead({
    abi: ABI,
    address: process.env.NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS as `0x${string}` | undefined,
    functionName: 'STAGE_MAX_TOKENS',
    watch: false,
  });

  const { data: mintedTokens } = useContractRead({
    abi: ABI,
    address: process.env.NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS as `0x${string}` | undefined,
    functionName: 'MINTED_TOKENS_COUNT',
    watch: false,
  });

  const nextClaimTime = claimTime as bigint;
  const stageMaxTokens = stageMax as bigint;
  const mintedTokensCount = mintedTokens as bigint;
  const isFaucetOpen = faucetOpen as boolean;

  return {
    isFaucetOpen,
    nextClaimTime: nextClaimTime?.toString(),
    stageMaxTokens: stageMaxTokens?.toString(),
    mintedTokensCount: mintedTokensCount?.toString(),
  };
};

export default useGetFaucetData;
