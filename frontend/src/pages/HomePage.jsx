import { Container, Grid, Text, VStack, Box, Image, Heading } from "@chakra-ui/react";

const HomePage = () => {
  return (
    <Container maxW="6xl" px={1} py={20}>
      <VStack spacing={12}>
        <Grid templateColumns="repeat(2, 1fr)" gap={10} w="full" alignItems="center">
          {/* Left Column */}
          <VStack spacing={7} align="start" justify="center">
            <Heading
              fontSize="4xl"
              fontWeight="bold"
              bgGradient="to-r"
              gradientFrom="cyan.400"
              gradientTo="blue.500"
              bgClip="text"
            >
              Where Parents and Babysitters Link
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Connect with trusted childcare providers in your community. Find the perfect match for your family's needs.
            </Text>
          </VStack>

          {/* Right Column */}
          <Box
            borderWidth="2px"
            borderColor="gray.200"
            borderRadius="2xl"
            p={6}
            position="relative"
            minH="420px"
            boxShadow="xl"
          >
            <Image 
              src="https://plus.unsplash.com/premium_photo-1711381022945-563ecae9118f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Parent and babysitter connecting"
              borderRadius="lg"
              objectFit="cover"
              w="full"
              h="full"
            />
          </Box>
        </Grid>
      </VStack>
    </Container>
  );
};

export default HomePage;
