import {
  AppShell,
  Header,
  Flex,
  Title,
  Text,
  Container,
  Grid,
  TextInput,
  Button,
  Box,
  Group,
} from '@mantine/core';
import { useBalance, useAccount, useContractReads } from 'wagmi';

import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { ConnectionProgress } from '@/components/Modals/ModalTypes';
import HeaderContainer from '@/components/HeaderContainer/HeaderContainer';
import TokenPurchaseModal from '@/components/Modals/TokenPurchaseModal/TokenPurchaseModal';
import WalletConnectButton from '@/components/WalletConnectButton/WalletConnectButton';

const ABI = require('@/contract/PresaleContractABI');

export default function HomePage() {
  const preSaleContract = {
    address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS as `0x${string}` | undefined,
    abi: ABI,
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
    ],
  });

  // TODO: To get from smart contract
  // const stageTokenPrice = 0.0001;
  // const stageTokenSupply = 99000;
  // const currentStage = 1;

  console.log({ preSaleStageStats, loadingStageStats, errorLoadingStageStats });

  // open/close states for token purchase modal
  const [opened, { open, close }] = useDisclosure(false);
  const [connectionProgress, setConnectionProgress] = useState<ConnectionProgress>(
    ConnectionProgress.SUCCESS
  );
  const [walletBalance, setWalletBalance] = useState<{ matic: number; token: number }>({
    matic: 0,
    token: 0,
  });
  const [currentStageStats, setCurrentStageStats] = useState<{
    stageTokenPrice: number;
    stageTokenSupply: number;
    currentStage: number;
  }>({ stageTokenPrice: 0, stageTokenSupply: 0, currentStage: 1 });

  // fetch connected account address from localStorage
  const { address, isDisconnected } = useAccount();

  // get account MATIC balance
  const { data: maticData } = useBalance({
    address,
  });

  // get account TSTX balance
  const { data: tokenData } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_TSTK_TOKEN_ADDRESS as `0x${string}` | undefined,
  });

  // account balance
  useEffect(() => {
    if (!maticData?.formatted || !tokenData?.formatted) return;
    setWalletBalance((prevState) => ({
      ...prevState,
      matic: +maticData.formatted,
      token: +tokenData.formatted,
    }));
  }, [maticData?.formatted, tokenData?.formatted]);

  // stage stats
  useEffect(() => {
    if (loadingStageStats || errorLoadingStageStats || !preSaleStageStats) return;
    setCurrentStageStats((prevState) => {
      const [price, stage, supply] = preSaleStageStats as {
        result: number;
        status: string;
      }[];
      return {
        ...prevState,
        stageTokenPrice: parseFloat(price.result.toString()) / 10 ** 18,
        stageTokenSupply: parseFloat(supply.result.toString()) / 10 ** 18,
        currentStage: stage.result,
      };
    });
  }, [loadingStageStats, errorLoadingStageStats, preSaleStageStats]);

  // getting 1,000,000 from the contract call for this
  const maxTokensPerStage = 10000;

  const form = useForm({
    initialValues: {
      tokenAmount: '',
    },

    validate: {
      tokenAmount: (value) => {
        if (!value) {
          return 'Token amount required';
        }

        // cannot buy above current stage max amount
        if (+value > maxTokensPerStage) {
          return 'Amount exceeds maximum tokens per stage.';
        }

        // cannot buy above current stage token supply
        if (+value > currentStageStats.stageTokenSupply) {
          return 'Amount exceeds current token supply.';
        }

        // cannot buy with insufficient wallet balance
        if (+value * currentStageStats.stageTokenPrice > walletBalance.matic) {
          return 'Insufficent funds.';
        }

        return null;
      },
    },
  });

  // submit form data to purchase token
  const handlePurchaseSubmit = (value: string) => {
    // open modal to confirm amounts
    open();
    console.log({ tokenAmount: value });
  };

  //TODO: Retry token purchase
  const retryTokenPurchase = () => {
    setConnectionProgress(ConnectionProgress.CONNECTING);

    // add more logic
  };

  //TODO: Contract call to purchase token
  const purchaseToken = () => {
    console.log('We are now making contract call to purchase token');
  };

  const totalPriceOfPurchase = +form.values.tokenAmount * currentStageStats.stageTokenPrice;
  const insufficientBalance = totalPriceOfPurchase > walletBalance.matic;

  return (
    <AppShell
      padding="md"
      fixed={false}
      style={{
        height: '100vh',
      }}
      header={
        <Header height={80} p="lg">
          <HeaderContainer walletConnected={false} />
        </Header>
      }
    >
      <Container size="lg" pt="xl">
        <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={120}>
          <Grid.Col span={6}>
            <Flex
              h="100%"
              gap="md"
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
              p="xl"
            >
              <Title
                order={1}
                size="h1"
                color="white"
                style={{
                  fontSize: '3.5rem',
                }}
              >
                Buy{' '}
                <span
                  style={{
                    color: 'rgb(147 51 234)',
                  }}
                >
                  TSTK
                </span>{' '}
                Now, to Get Rich In The Future
              </Title>
              <Text mt="lg" mb="xl">
                TSTK is not just a DeFi token, it is the best DeFi token that you can invest in
                right now!
              </Text>
            </Flex>
          </Grid.Col>

          <Grid.Col span={6}>
            <Flex
              mih={50}
              gap="md"
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
              p="xl"
              style={{
                borderRadius: '0.75rem',
                backgroundColor: '#28320E',
              }}
            >
              {/* Countdown timer  */}
              <Text mb="sm" align="left" size="1.3rem" w="100%" color="white" fw="bold">
                Presale Stage #{currentStageStats.currentStage.toString()} Ends In:
              </Text>

              <Grid
                gutter={5}
                gutterXs="md"
                gutterMd="xl"
                gutterXl={20}
                grow
                style={{
                  width: '100%',
                }}
                p={0}
              >
                <Grid.Col span={4}>
                  <div
                    style={{
                      borderRadius: '0.5rem',
                      backgroundColor: '#485A16',
                      padding: '20px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Text fw="bold" size="3rem" color="white">
                      15
                    </Text>
                    <Text fw="bold" size="sm" color="white">
                      HOURS
                    </Text>
                  </div>
                </Grid.Col>
                <Grid.Col span={4}>
                  <div
                    style={{
                      borderRadius: '0.5rem',
                      backgroundColor: '#485A16',
                      padding: '20px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Text fw="bold" size="3rem" color="white">
                      09
                    </Text>
                    <Text fw="bold" size="sm" color="white">
                      MINUTES
                    </Text>
                  </div>
                </Grid.Col>
                <Grid.Col span={4}>
                  <div
                    style={{
                      borderRadius: '0.5rem',
                      backgroundColor: '#485A16',
                      padding: '20px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Text fw="bold" size="3rem" color="white">
                      45
                    </Text>
                    <Text fw="bold" size="sm" color="white">
                      SECONDS
                    </Text>
                  </div>
                </Grid.Col>
              </Grid>

              {/* stats about token  */}
              <Flex
                mih={50}
                w="100%"
                gap="0"
                justify="center"
                align="flex-start"
                direction="column"
                wrap="wrap"
              >
                <div
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                  }}
                >
                  <Text size="1rem" fw={500} color="white">
                    Presale Supply:{' '}
                    <span>{currentStageStats.stageTokenSupply.toLocaleString()} TSTK</span>
                  </Text>
                </div>

                <div
                  style={{
                    width: '100%',
                  }}
                >
                  <Text size="1rem" fw={500} color="white">
                    Maximum purchase amount: <span>{maxTokensPerStage.toLocaleString()} TSTK</span>
                  </Text>
                </div>
                <div
                  style={{
                    width: '100%',
                    marginTop: '.2rem',
                  }}
                >
                  <Text size="1rem" fw={500} color="white">
                    Presale Price: <span>{currentStageStats.stageTokenPrice} MATIC</span>
                  </Text>
                </div>
              </Flex>

              {/* form with input and submit */}
              <Box w="100%" mx="auto">
                <form
                  onSubmit={form.onSubmit((values) => handlePurchaseSubmit(values.tokenAmount))}
                >
                  <TextInput
                    placeholder="Enter token amount"
                    radius="md"
                    size="lg"
                    my="1rem"
                    w="100%"
                    min={1}
                    step="0.00001"
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
                      size="lg"
                      uppercase
                      style={{
                        backgroundColor: '#CAFC36',
                        color: '#000000',
                      }}
                      fullWidth
                      type="submit"
                    >
                      <Text fz="md">buy TSTK Tokens</Text>
                    </Button>
                  )}
                </form>
              </Box>
              <Box
                sx={{
                  borderRadius: '0.75rem',
                  backgroundColor: '#304221',
                  padding: '20px',
                  width: '100%',
                }}
              >
                <Group position="apart">
                  <Text size="1rem" fw={500} color="white">
                    Amount to pay
                  </Text>
                  <Text size="1rem" fw={600} color={insufficientBalance ? 'red' : 'white'}>
                    {totalPriceOfPurchase.toFixed(5)} MATIC
                  </Text>
                </Group>

                <Group position="apart">
                  <Text size="1rem" fw={500} color="white">
                    Wallet Balance
                  </Text>
                  <Text size="1rem" fw={600} color="white">
                    {walletBalance.matic.toFixed(5)} MATIC
                  </Text>
                </Group>

                <Group position="apart" mt="md">
                  <Text size="1.2rem" fw={500} color="white">
                    You own
                  </Text>
                  <Text size="1.2rem" fw={600} color="white">
                    {walletBalance.token.toFixed(5)} TSTK
                  </Text>
                </Group>
              </Box>
            </Flex>
          </Grid.Col>
        </Grid>

        {/* token purchase modal  */}
        <TokenPurchaseModal
          opened={opened}
          close={close}
          connectionProgress={connectionProgress}
          setConnectionProgress={setConnectionProgress}
          tokenAmount={form.values.tokenAmount}
          walletMaticBalance={walletBalance.matic}
          stageTokenPrice={currentStageStats.stageTokenPrice ?? 0}
          totalPriceOfPurchase={totalPriceOfPurchase}
          retryRequest={retryTokenPurchase}
          submitRequest={purchaseToken}
        />
      </Container>
    </AppShell>
  );
}
