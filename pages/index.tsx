import { AppShell, Header, Flex, Text, Container, Grid } from '@mantine/core';
import HeaderContainer from '@/components/HeaderContainer/HeaderContainer';
import CountdownTimer from '@/components/CountdownTimer/CountdownTimer';
import CurrentStageStats from '@/components/CurrentStageStats/CurrentStageStats';
import TokenPurchaseForm from '@/components/TokenPurchaseForm/TokenPurchaseForm';
import TstkBanner from '@/components/TstkBanner/TstkBanner';
import useGetCurrentStageStats from '@/hooks/useGetCurrentStageStats';
import useGetAccountBalances from '@/hooks/useGetAccountBalances';
import useGetFaucetData from '@/hooks/useGetFaucetData';

export default function HomePage() {
  const {
    currentStage,
    currentStageStartTime,
    stageTokenPrice,
    stageTokenSupply,
    maxTokensPerStage,
  } = useGetCurrentStageStats();
  const { maticBalance, tokenBalance } = useGetAccountBalances();
  const { isFaucetOpen, stageMaxTokens, mintedTokensCount } = useGetFaucetData();

  const restTotal = (Number(stageMaxTokens || 0) - Number(mintedTokensCount || 0)) / 10 ** 18;

  return (
    <AppShell
      padding="md"
      fixed={false}
      style={{
        height: '100vh',
      }}
      header={
        <>
          <div
            style={{
              height: '24px',
              backgroundColor: '#fcd535',
            }}
          >
            <Text mb="sm" align="center" w="100%" color="white" fw="bold">
              Powered by Binance Smart Chain
            </Text>
          </div>
          <Header height={80} p="lg">
            <HeaderContainer />
          </Header>
        </>
      }
    >
      <Container size="lg" pt="xl">
        <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={120}>
          <Grid.Col xs={12} sm={6}>
            <TstkBanner />
          </Grid.Col>

          <Grid.Col xs={12} sm={6}>
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
                Presale Stage Ends In:
              </Text>
              <CountdownTimer currentStageStartTime={currentStageStartTime} />

              {/* stats about current stage  */}
              <CurrentStageStats
                currentStage={currentStage}
                stageTokenPrice={stageTokenPrice}
                stageTokenSupply={isFaucetOpen ? restTotal : stageTokenSupply}
                isFaucetOpen={isFaucetOpen}
                maxTokensPerStage={maxTokensPerStage}
              />

              {/* form with input and submit button along with transaction modal */}
              <TokenPurchaseForm
                isPurchaseOpen
                currentStage={currentStage}
                stageTokenPrice={stageTokenPrice}
                stageTokenSupply={stageTokenSupply}
                maxTokensPerStage={maxTokensPerStage}
                walletMaticBalance={maticBalance}
                walletTokenBalance={tokenBalance}
              />
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>
    </AppShell>
  );
}
