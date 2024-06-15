import { Text, Image, Flex, Anchor, Button } from '@mantine/core';
import { ModalSuccessStateProps } from '@/components/Modals/types';

/**
 * Modal section to show success upon token purchase
 * @prop closeModal - function to close the modal
 * @prop tokenAmount - amount of tokens purchased
 * @props transactionHash - transaction hash
 * @returns React node
 */
const ModalSuccessState: React.FC<ModalSuccessStateProps> = ({
  closeModal,
  tokenAmount,
  transactionHash,
}) => (
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
        border: '3px solid #CAFC36',
        padding: '10px',
        width: '6.25rem',
        height: '6.25rem',
      }}
    >
      {' '}
      <Image maw={64} mx="auto" radius="md" src="/success.svg" alt="success icon" />
    </div>
    <Text fz="lg" fw="bold" color="white">
      Request successful
    </Text>
    <Text align="center">You just purchased {tokenAmount} CLTS tokens.</Text>

    {/* show link to contract call for confirmation  */}
    {Boolean(transactionHash) && (
      <Anchor
        href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
        target="_blank"
        style={{
          cursor: 'pointer',
        }}
      >
        View on Polygonscan
      </Anchor>
    )}

    <Button
      radius="md"
      uppercase
      fullWidth
      size="lg"
      style={{
        backgroundColor: '#CAFC36',
        color: '#000000',
      }}
      onClick={closeModal}
    >
      <Text fz="md">Close</Text>
    </Button>
  </Flex>
);

export default ModalSuccessState;
