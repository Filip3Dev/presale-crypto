import { Button, Text, Image, Modal, Flex, ActionIcon, Box, Group, Title } from '@mantine/core';
import { IconRotateClockwise } from '@tabler/icons-react';
import { TokenPurchaseModalProps, ConnectionProgress } from '@/components/Modals/ModalTypes';

const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({
  opened,
  close,
  connectionProgress,
  setConnectionProgress,
  totalPriceOfPurchase,
  tokenAmount,
  walletMaticBalance,
  stageTokenPrice,
}) => (
  <Modal
    opened={opened}
    onClose={close}
    withCloseButton={false}
    centered
    size="sm"
    radius="lg"
    padding="xl"
  >
    {/* token and price details to show to the user  */}
    <Title color="white" fw="bold" fz="xl" mb="xl">
      Buy TSTK Tokens
    </Title>
    <Box
      sx={{
        borderRadius: '0.75rem',
        padding: '20px',
        width: '100%',
        backgroundColor: '#25262B',
      }}
    >
      <Text color="white" fw={500}>
        You pay
      </Text>
      <Group position="apart">
        <Text size="1.2rem" fw={600} color="white">
          {totalPriceOfPurchase.toFixed(5)}
        </Text>
        <Flex gap="xs" align="center">
          <Image maw={20} mx="auto" src="/polygon-matic-logo.svg" alt="matic icon" />{' '}
          <Text fw="bold">MATIC</Text>
        </Flex>
      </Group>
      <Group position="right" w="100%" mt=".5rem">
        <Text size="sm">
          Balance: <span>{walletMaticBalance.toFixed(5)}</span>
        </Text>
      </Group>
    </Box>
    <Box
      sx={{
        borderRadius: '0.75rem',
        padding: '20px',
        width: '100%',
        backgroundColor: '#25262B',
        marginTop: '.5rem',
      }}
    >
      <Text color="white" fw={500}>
        You receive
      </Text>
      <Group position="apart">
        <Text size="1.2rem" fw={600} color="white">
          {tokenAmount}
        </Text>
        <Flex gap="xs">
          <Image maw={24} mx="auto" src="/tstk-token-symbol.png" alt="tstk icon" />{' '}
          <Text fw="bold">TSTK</Text>
        </Flex>
      </Group>
      <Group position="right" w="100%" mt=".5rem">
        <Text size="sm">
          1 TSTK = <span>{stageTokenPrice.toFixed(5)}</span> MATIC
        </Text>
      </Group>
    </Box>
    {connectionProgress === ConnectionProgress.PENDING && (
      <Button
        radius="md"
        fullWidth
        size="lg"
        mt="md"
        uppercase
        style={{
          backgroundColor: '#CAFC36',
          color: '#000000',
        }}
        onClick={() => setConnectionProgress(ConnectionProgress.CONNECTING)}
      >
        <Text fz="md">Continue</Text>
      </Button>
    )}

    {/* connection request initiated. Awaiting user approval from extension  */}
    {connectionProgress === ConnectionProgress.CONNECTING && (
      <>
        <Text color="white" fw="bold" fz="xl" align="center">
          MetaMask
        </Text>
        <Flex
          mih={50}
          gap="md"
          justify="flex-start"
          align="center"
          direction="column"
          wrap="wrap"
          mt="xl"
        >
          <div
            style={{
              position: 'relative',
            }}
          >
            <Image maw={100} mx="auto" radius="md" src="/spinner.svg" alt="spinner icon" />
            <Image
              maw={64}
              mx="auto"
              radius="md"
              src="/metamaskIcon.svg"
              alt="metamask icon"
              styles={{
                root: {
                  position: 'absolute',
                  inset: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              }}
            />
          </div>
          <Text fz="lg" fw="bold" color="white">
            Requesting connection
          </Text>
          <Text align="center">Please approve the request from your MetaMask extension</Text>
        </Flex>
      </>
    )}

    {/* user rejected the connection request  */}
    {connectionProgress === ConnectionProgress.REJECTED && (
      <>
        <Text color="white" fw="bold" fz="xl" align="center">
          MetaMask
        </Text>
        <Flex
          mih={50}
          gap="md"
          justify="flex-start"
          align="center"
          direction="column"
          wrap="wrap"
          mt="xl"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '3px solid red',
              padding: '10px',
              width: '6.25rem',
              height: '6.25rem',
            }}
          >
            {' '}
            <Image maw={64} mx="auto" radius="md" src="/metamaskIcon.svg" alt="metamask icon" />
          </div>
          <Text fz="lg" fw="bold" color="white">
            Request cancelled
          </Text>
          <Text align="center">
            You cancelled the request.
            <br /> Click below to retry
          </Text>

          <ActionIcon size="xl" radius="xl" variant="filled">
            <IconRotateClockwise size="2.125rem" />
          </ActionIcon>
        </Flex>
      </>
    )}
  </Modal>
);

export default TokenPurchaseModal;