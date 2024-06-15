import { Button, Text, Modal } from '@mantine/core';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useEffect } from 'react';
import { bscTestnet } from 'wagmi/chains';
import { useDebounce } from 'usehooks-ts';
import { TokenPurchaseModalProps, ConnectionProgress } from '@/components/Modals/types';
import ModalErrorState from '@/components/Modals/ModalProgressStates/ModalErrorState/ModalErrorState';
import ModalConnectingState from '@/components/Modals/ModalProgressStates/ModalConnectingState/ModalConnectingState';
import ModalSuccessState from '@/components/Modals/ModalProgressStates/ModalSuccessState/ModalSuccessState';
import ModalPurchaseDetails from '@/components/Modals/ModalProgressStates/ModalPurchaseDetails/ModalPurchaseDetails';
import useGetAccountBalances from '@/hooks/useGetAccountBalances';
import useGetCurrentStageStats from '@/hooks/useGetCurrentStageStats';
import { ABI } from '@/contract/PresaleContractABI';

/**
 * Modal to show progress of the token purchase
 * @prop opened - boolean state to open modal
 * @prop close - function to close modal
 * @prop connectionProgress - progress of transaction request
 * @prop setConnectionProgress - change the progress state of the transaction
 * @prop totalPriceOfPurchase - total price to purchase given amount of tokens
 * @prop tokenAmount - amount of tokens to purchase
 * @prop walletMaticBalance - Matic balance of the current account
 * @prop stageTokenPrice - price of one token for the current stage.
 * @returns
 */

const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({
  opened,
  close,
  connectionProgress,
  setConnectionProgress,
  totalPriceOfPurchase,
  tokenAmount,
  walletMaticBalance,
  stageTokenPrice,
}) => {
  const debouncedTokenAmount = useDebounce(tokenAmount, 500);
  const tokenDecimals = 18;

  const value = (10 ** tokenDecimals) * +totalPriceOfPurchase;

  const { refetchMaticBalance, refetchTokenBalance } = useGetAccountBalances();
  const { refetchCurrentStageStats } = useGetCurrentStageStats();

  const { config, isError: prepError } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS as `0x${string}` | undefined,
    abi: ABI,
    functionName: 'tokenSale',
    args: [tokenAmount],
    value: BigInt(value),
    enabled: Boolean(debouncedTokenAmount),
    chainId: bscTestnet.id,
  });

  const { data, write, reset, isError: writeError } = useContractWrite(config);
  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
  });

  // reset modal state when modal is closed.
  const handleClose = () => {
    setConnectionProgress(ConnectionProgress.NOT_STARTED);
    close();
    reset();
  };

  // show wallet approval state and initiate write
  const handleWriteContract = () => {
    setConnectionProgress(ConnectionProgress.PENDING);
    write?.();
  };

  // show different modal states based on status of transaction
  useEffect(() => {
    if (isLoading && !isError && !writeError) {
      setConnectionProgress(ConnectionProgress.CONNECTING);
    } else if (isError || writeError) {
      setConnectionProgress(ConnectionProgress.ERROR);
    } else if (isSuccess) {
      setConnectionProgress(ConnectionProgress.SUCCESS);

      // refetch account balances
      refetchMaticBalance();
      refetchTokenBalance();

      // refetch stage stats
      refetchCurrentStageStats();
    } else {
      setConnectionProgress(ConnectionProgress.NOT_STARTED);
    }
  }, [isLoading, isSuccess, isError, writeError]);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      withCloseButton={false}
      centered
      size="sm"
      radius="lg"
      padding="xl"
    >
      {/* token and price details to show to the user  */}
      <ModalPurchaseDetails
        tokenAmount={tokenAmount}
        walletMaticBalance={walletMaticBalance}
        stageTokenPrice={stageTokenPrice}
        totalPriceOfPurchase={totalPriceOfPurchase}
      />
      {connectionProgress === ConnectionProgress.NOT_STARTED && (
        <>
          <Button
            radius="md"
            fullWidth
            size="lg"
            id="modal_buy_btn"
            mt="md"
            uppercase
            disabled={!write}
            style={{
              backgroundColor: prepError ? '#ff5757' : '#CAFC36',
              color: '#000000',
            }}
            onClick={prepError ? () => handleClose() : handleWriteContract}
          >
            <Text fz="md">{prepError ? "Can't buy" : 'Buy now'}</Text>
          </Button>
        </>
      )}

      {/* connection request initiated. awaiting user approval from extension  */}
      {connectionProgress === ConnectionProgress.PENDING &&
        !isLoading &&
        !isSuccess &&
        !isError && (
          <ModalConnectingState connectionRequestText="Please approve this purchase request from your wallet." />
        )}

      {/* request approved by user. processing transaction  */}
      {connectionProgress === ConnectionProgress.CONNECTING && (
        <ModalConnectingState
          titleText="Buying tokens"
          connectionRequestText="Purchasing your awesome tokens."
          isInProgress
        />
      )}

      {/* transaction has an error  */}
      {connectionProgress === ConnectionProgress.ERROR && <ModalErrorState />}

      {/* token purchase was a success  */}
      {connectionProgress === ConnectionProgress.SUCCESS && (
        <ModalSuccessState
          closeModal={handleClose}
          tokenAmount={tokenAmount}
          transactionHash={data?.hash}
        />
      )}
    </Modal>
  );
};

export default TokenPurchaseModal;
