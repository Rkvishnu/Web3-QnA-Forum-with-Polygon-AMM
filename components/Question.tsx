import * as React from 'react';
import NextLink from 'next/link';
import { Box, Heading, HStack, Flex, Badge, Spacer, Text, LinkBox, LinkOverlay } from '@chakra-ui/react';
import TimeAgo from 'react-timeago';
import Username from './Username';
import Avatar from '@davatar/react/dist/Image';
import { useProvider } from 'wagmi';
import { Question as QuestionStruct } from '../hooks/contracts/useForumContract';
import useAnswers from '../hooks/useAnswers';

interface QuestionProps extends QuestionStruct {
  answerPage?: boolean;
}

const Question: React.FunctionComponent<QuestionProps> = ({
  questionId,
  message,
  creatorAddress,
  timestamp,
  answerPage,
}) => {

  const provider = useProvider();
  const answersQuery = useAnswers({ questionId });

  return (
    <>
      {!answerPage ? (
        <HStack spacing={3} alignItems='center'>
          <Avatar size={48} provider={provider} address={creatorAddress} />
          <LinkBox as='article' flex={1} borderWidth='1px' rounded='md' p={3}>
            <Box>
              <TimeAgo date={Number(timestamp) * 1000} />
            </Box>
            <Heading size='md' my='2'>
              <NextLink href='/question/[id]' as={`/question/${questionId}`} passHref>
                <LinkOverlay>{message}</LinkOverlay>
              </NextLink>
            </Heading>
            <Flex alignItems='center' w='100%'>
              <Badge borderRadius='full' px='5' color='purple.400' colorScheme='purple'>
                <Username address={creatorAddress} />
              </Badge>
              <Spacer />
              {answersQuery.isFetched && (
                <Badge px='5' borderRadius='full' colorScheme='gray'>
                  <Text color='gray.500'>{answersQuery.data?.length} answers</Text>
                </Badge>
              )}
            </Flex>
          </LinkBox>
        </HStack>
      ) : (
        <HStack spacing={3} alignItems='center'>
          <Avatar size={48} provider={provider} address={creatorAddress} />
          <LinkBox as='article' flex={1} borderWidth='1px' rounded='md' p={3}>
            <NextLink href='/' passHref>
              <LinkOverlay>
                <Text color='white' fontSize='lg'>
                  {message}
                </Text>
              </LinkOverlay>
            </NextLink>
            <Flex alignItems='center' w='100%'>
              <Badge borderRadius='full' px='5' color='purple.400' colorScheme='purple'>
                <Username address={creatorAddress} />
              </Badge>
              <Text px='8px' fontSize='sm'>
                <TimeAgo date={Number(timestamp) * 1000} />
              </Text>
              <Spacer />
            </Flex>
          </LinkBox>
        </HStack>
      )}
    </>
  );
};

export default Question;
