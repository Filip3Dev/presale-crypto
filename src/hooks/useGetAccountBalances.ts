import { useBalance, useAccount, useContractRead } from 'wagmi';
import { formatEther } from 'viem';
import { useState, useEffect } from 'react';
import { ABI } from '@/contract/TokenContractABI';

/**
 * Hook to get matic and CLTS balance of the connected account.
 * Also returns methods to refetch these values.
 * @returns
 */
const useGetAccountBalances = (): {
  maticBalance: number;
  tokenBalance: number;
  refetchMaticBalance: () => void;
  refetchTokenBalance: () => void;
} => {
  const [walletBalance, setWalletBalance] = useState<{
    maticBalance: number;
    tokenBalance: number;
  }>({
    maticBalance: 0,
    tokenBalance: 0,
  });

  // get connected account
  const { address } = useAccount();

  // get account MATIC balance
  const { data: maticData, refetch: refetchMaticBalance } = useBalance({
    address,
  });

  const { data, refetch: refetchTokenBalance } = useContractRead({
    abi: ABI,
    address: process.env.NEXT_PUBLIC_CLTS_TOKEN_ADDRESS as `0x${string}` | undefined,
    functionName: 'balanceOf',
    args: [address],
    watch: false,
  });
  const tokenBalance = data as bigint;

  // account balances
  useEffect(() => {
    if (!maticData || !tokenBalance) return;
    setWalletBalance({
      maticBalance: Number(maticData.formatted),
      tokenBalance: Number(tokenBalance ? formatEther(tokenBalance) : 0),
    });
  }, [maticData, data]);

  const balances = {
    maticBalance: Number(maticData ? maticData.formatted : 0),
    tokenBalance: Number(tokenBalance ? formatEther(tokenBalance) : 0),
  };

  return { ...balances, refetchMaticBalance, refetchTokenBalance };
};

export default useGetAccountBalances;
