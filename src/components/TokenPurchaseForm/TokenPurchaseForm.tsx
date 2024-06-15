import { Box, TextInput, Button, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import WalletConnectButton from '@/components/WalletConnectButton/WalletConnectButton';
import { TokenPurchaseModalProps } from '@/components/TokenPurchaseForm/types';
import TokenPurchaseModal from '@/components/Modals/TokenPurchaseModal/TokenPurchaseModal';
import { ConnectionProgress } from '@/components/Modals/types';
import TokenPurchaseBalances from '@/components/TokenPurchaseBalances/TokenPurchaseBalances';
import useGetFaucetData from '@/hooks/useGetFaucetData';

/**
 * Form with input field and button to purchase CLTS tokens
 * @prop stageTokenPrice,
 * @prop stageTokenSupply,
 * @prop maxTokensPerStage,
 * @prop walletMaticBalance,
 * @prop walletTokenBalance,
 * @returns
 */
const TokenPurchaseForm: React.FC<TokenPurchaseModalProps> = ({
  stageTokenPrice,
  stageTokenSupply,
  maxTokensPerStage,
  walletMaticBalance,
  walletTokenBalance,
  isPurchaseOpen,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { isFaucetOpen } = useGetFaucetData();
  const [connectionProgress, setConnectionProgress] = useState<ConnectionProgress>(
    ConnectionProgress.PENDING
  );
  const { isDisconnected, isConnected } = useAccount();

  const form = useForm({
    initialValues: {
      tokenAmount: '10',
    },

    validate: {
      tokenAmount: (value) => {
        if (!value) {
          return 'Token amount required';
        }

        // cannot buy above current stage max amount
        if (maxTokensPerStage && +value > maxTokensPerStage) {
          return 'Amount exceeds maximum tokens per stage.';
        }

        // cannot buy above current stage token supply
        if (!isFaucetOpen && +value > stageTokenSupply) {
          return 'Amount exceeds current token supply.';
        }

        // cannot buy with insufficient wallet balance
        if (+value * stageTokenPrice > walletMaticBalance) {
          return 'Insufficent funds.';
        }

        return null;
      },
    },
  });

  // // open modal to confirm amounts
  const handlePurchaseSubmit = () => {
    open();
  };

  const totalPriceOfPurchase = +form.values.tokenAmount * stageTokenPrice;
  const insufficientBalance = totalPriceOfPurchase > walletMaticBalance;

  return (
    <>
      <Box w="100%" mx="auto">
        <form onSubmit={form.onSubmit(handlePurchaseSubmit)}>
          <TextInput
            placeholder="Enter token amount"
            radius="md"
            size="lg"
            my="1rem"
            w="100%"
            min={1}
            step="0.001"
            {...form.getInputProps('tokenAmount')}
            type="number"
            styles={{
              input: {
                backgroundColor: 'transparent',
                border: '1px solid #485A16',
                color: 'white',
                fontWeight: 500,
                '&:hover': {
                  border: '1px solid green',
                },
                '&:focus': {
                  border: '1px solid green',
                },
              },
            }}
          />

          {/* button to submit  */}
          {isDisconnected ? (
            <WalletConnectButton text="Connect wallet to buy" size="lg" isFullWidth />
          ) : (
            <Button
              radius="md"
              id="master_buy"
              size="lg"
              uppercase
              style={{
                backgroundColor: '#CAFC36',
                color: '#000000',
              }}
              fullWidth
              type="submit"
              disabled={!isPurchaseOpen}
            >
              <Text fz="md">Buy CLTS Tokens</Text>
            </Button>
          )}
        </form>
      </Box>

      {/* show balances depending on the amount of token  */}
      {isConnected && (
        <TokenPurchaseBalances
          walletMaticBalance={walletMaticBalance}
          walletTokenBalance={walletTokenBalance}
          totalPriceOfPurchase={totalPriceOfPurchase}
          insufficientBalance={insufficientBalance}
        />
      )}

      {/* token purchase modal  */}
      <TokenPurchaseModal
        opened={opened}
        close={close}
        connectionProgress={connectionProgress}
        setConnectionProgress={setConnectionProgress}
        tokenAmount={form.values.tokenAmount}
        walletMaticBalance={walletMaticBalance}
        stageTokenPrice={stageTokenPrice ?? 0}
        totalPriceOfPurchase={totalPriceOfPurchase}
      />
    </>
  );
};

export default TokenPurchaseForm;
