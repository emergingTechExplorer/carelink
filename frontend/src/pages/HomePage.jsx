import { Container, Grid, Text, VStack, Box, Image, Heading, Button, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SearchPage from "@/pages/SearchPage.jsx";
import BabysitterEditPage from "@/pages/NannyEdit.jsx";

const HomePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  if (user != null){
    if (user.role === "PARENT") {
      return (
          <SearchPage></SearchPage>
      )
    }
    if (user.role === "BABYSITTER") {
      return (
          <BabysitterEditPage></BabysitterEditPage>
      )
    }
  }

  return (
    <Container maxW="6xl" px={1} py={20}>
      <VStack spacing={12}>
        <Grid templateColumns="repeat(2, 1fr)" gap={10} w="full" alignItems="center">
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
              Connect with trusted childcare providers in your community. Find the perfect match for your family&#39;s needs.
            </Text>
            {user?.role === "PARENT" && (
                <HStack spacing={4}>
                  <Button colorScheme="blue" onClick={() => navigate("/search")}>Explore</Button>
                </HStack>
            )}
            {user?.role === "BABYSITTER" && (
                <HStack spacing={4}>
                  <Button colorScheme="blue" onClick={() => navigate("/nanny-edit")}>Explore</Button>
                </HStack>
            )}
          </VStack>
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
