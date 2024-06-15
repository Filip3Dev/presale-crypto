import { Flex, Text } from '@mantine/core';
import { CurrentStageValues } from '@/components/CurrentStageStats/types';

/**
 * @prop stageTokenPrice - current stage token price
 * @prop stageTokenSupply - available tokens for the current stage
 * @prop maxTokensPerStage - maximum tokens a wallet can purchase per stage
 * @prop isFaucetOpen - check if faucet is open
 * @returns
 */
const CurrentStageStats: React.FC<CurrentStageValues> = ({
  stageTokenPrice,
  stageTokenSupply,
  maxTokensPerStage,
  isFaucetOpen,
}) => (
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
        Presale Supply: <span>{stageTokenSupply.toLocaleString()} CLTS</span>
      </Text>
    </div>

    <div
      style={{
        width: '100%',
      }}
    >
      {
        !isFaucetOpen && (
          <Text size="1rem" fw={500} color="white">
            Maximum purchase amount:{' '}
            <span>{maxTokensPerStage && maxTokensPerStage.toLocaleString()} CLTS</span>
          </Text>
        ) 
      }
    </div>
    <div
      style={{
        width: '100%',
        marginTop: '.2rem',
      }}
    >
      <Text size="1rem" fw={500} color="white">
        Presale Price:
        {stageTokenPrice == 0 ? (
          <>
            <span> FREE MINT </span>
          </>
        ) : (
          <>
            <span> {stageTokenPrice} MATIC</span>
          </>
        )}
      </Text>
    </div>
  </Flex>
);

export default CurrentStageStats;
