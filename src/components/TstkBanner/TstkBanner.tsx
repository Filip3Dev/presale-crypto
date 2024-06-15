import { Flex, Title, Text, Button } from '@mantine/core';

const openTab = () => {
  if (window && typeof window !== undefined) {
    const win = window.open('https://www.creditledger.xyz?utm_source=web3_app', '_blank');
    win?.focus();
  }
};

/**
 * component to show a small welcome text for the CLTS token
 * @returns React node
 */
const TstkBanner: React.FC = () => (
    <Flex h="100%" gap="md" justify="center" align="center" direction="column" wrap="wrap" p="xl">
      <Title
        order={1}
        size="h1"
        color="white"
        style={{
          fontSize: '3.5rem',
        }}
      >
        <span> Buy </span>
        <span
          style={{
            color: 'rgb(147 51 234)',
          }}
        >
          CLTS
        </span>{' '}
        <span>Now, to receive monthly income</span>
      </Title>
      <Text mt="lg" mb="xl">
        Credit Ledger provides access to yield generated from insured short-term receivables sourced
        and underwritten by Fintechs of 5 diferent countries.
      </Text>
      <div>
        <Button
          radius="md"
          size="lg"
          id="checkout_website"
          uppercase
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #CAFC36',
            color: '#CAFC36',
          }}
          onClick={() => openTab()}
        >
          <Text fz="md">Checkout our website</Text>
        </Button>
      </div>
    </Flex>
  );

export default TstkBanner;
