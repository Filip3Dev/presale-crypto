import { Box, Group, Text } from '@mantine/core';
import { TokenFormBalancesProps } from '@/components/TokenPurchaseForm/types';

const TokenPurchaseBalances: React.FC<TokenFormBalancesProps> = ({
  insufficientBalance,
  totalPriceOfPurchase,
  walletMaticBalance,
  walletTokenBalance,
}) => (
  <Box
    sx={{
      borderRadius: '0.75rem',
      backgroundColor: '#304221',
      padding: '20px',
      width: '100%',
    }}
  >
    <Group position="apart">
      <Text size="1rem" fw={500} color={insufficientBalance ? 'red' : 'white'}>
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
        {walletMaticBalance.toFixed(5)} MATIC
      </Text>
    </Group>

    <Group position="apart" mt="md">
      <Text size="1.2rem" fw={500} color="white">
        You own
      </Text>
      <Text size="1.2rem" fw={600} color="white">
        {walletTokenBalance.toFixed(5)} CLTS
      </Text>
    </Group>
  </Box>
);

export default TokenPurchaseBalances;
