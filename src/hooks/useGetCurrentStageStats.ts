import { useContractReads, usePublicClient } from 'wagmi';
import { useState, useEffect } from 'react';
import { ABI } from '@/contract/PresaleContractABI';

/**
 * Hook to get current stage details as follows:
 * 1. stageTokenPrice - token price for the current stage
 * 2. stageTokenSupply - amount of tokens that are available for purchase in the stage
 * 3. currentStage - current stage number
 * 5. currentStageStartBlock - block number at which current stage started
 * 6. currentStageStartTime - timestamp of the current stage start block
 * 7. maxTokensPerStage - Maximum tokens a wallet can purchase per stage
 * @returns
 */
const useGetCurrentStageStats = (): {
  stageTokenPrice: number;
  stageTokenSupply: number;
  currentStage: number;
  currentStageStartBlock: number;
  currentStageStartTime: BigInt;
  maxTokensPerStage: number;
} => {
  const [currentStageStats, setCurrentStageStats] = useState<{
    stageTokenPrice: number;
    stageTokenSupply: number;
    currentStage: number;
    currentStageStartBlock: number;
  }>({ stageTokenPrice: 0, stageTokenSupply: 0, currentStage: 1, currentStageStartBlock: 0 });
  const [currentStageStartTime, setCurrentStageStartTime] = useState<BigInt>(BigInt(0));

  const publicClient = usePublicClient();

  // contract calls to get stage details
  const preSaleContract = {
    address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS as `0x${string}` | undefined,
    abi: ABI as any,
  };

  const {
    data: preSaleStageStats,
    isError: errorLoadingStageStats,
    isLoading: loadingStageStats,
  } = useContractReads({
    contracts: [
      {
        ...preSaleContract,
        functionName: 'currentStagePrice',
      },
      {
        ...preSaleContract,
        functionName: 'currentStage',
      },
      {
        ...preSaleContract,
        functionName: 'currentStageAvailableAmount',
      },
      {
        ...preSaleContract,
        functionName: 'currentStageBlockStart',
      },
    ],
  });

  useEffect(() => {
    if (loadingStageStats || errorLoadingStageStats || !preSaleStageStats) return;
    setCurrentStageStats((prevState) => {
      const [price, stage, supply, block] = preSaleStageStats as {
        result: number;
        status: string;
      }[];
      return {
        ...prevState,
        stageTokenPrice: parseFloat(price.result.toString()) / 10 ** 18,
        stageTokenSupply: parseFloat(supply.result.toString()) / 10 ** 18,
        currentStage: stage.result,
        currentStageStartBlock: block.result,
      };
    });
  }, [loadingStageStats, errorLoadingStageStats, preSaleStageStats]);

  // get the timestamp of the current stage start block
  useEffect(() => {
    if (!currentStageStats.currentStageStartBlock) return;
    publicClient
      .getBlock({
        blockNumber: BigInt(currentStageStats.currentStageStartBlock),
      })
      .then((blockDetails) => setCurrentStageStartTime(blockDetails.timestamp))
      .catch((error) => console.log(error));
  }, [currentStageStats.currentStageStartBlock, publicClient]);

  return {
    ...currentStageStats,
    maxTokensPerStage: 10000,
    currentStageStartTime,
  };
};

export default useGetCurrentStageStats;
