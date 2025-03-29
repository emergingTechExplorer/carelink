import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const mockNannies = [
  {
    firstName: "Emily",
    lastName: "Smith",
    age: 28,
    license: "NY12345678",
    address: "456 Main Street, New York, NY",
    experience: 6,
    rate: "$20/hr",
    bio: "Loving nanny with over 6 years of experience. CPR certified and specializes in early childhood care.",
    image: "https://images.pexels.com/photos/3763575/pexels-photo-3763575.jpeg",
    reviews: ["Emily is amazing!", "Punctual and responsible."],
    timeAvailability: "Full day",
    availableDays: ["Mon", "Tue", "Wed", "Thu"],
  },
  {
    firstName: "Sarah",
    lastName: "Lee",
    age: 32,
    license: "NY7654321",
    address: "123 Brooklyn Ave, NY",
    experience: 4,
    rate: "$18/hr",
    bio: "Energetic nanny who loves crafts and music. CPR certified and great with toddlers.",
    image: "https://images.pexels.com/photos/3997349/pexels-photo-3997349.jpeg",
    reviews: ["Super fun!", "Very patient and kind."],
    timeAvailability: "7am - 12pm",
    availableDays: ["Mon", "Wed", "Fri"],
  },
  {
    firstName: "Nina",
    lastName: "Gomez",
    age: 26,
    license: "NY24681012",
    address: "789 Park Ave, NY",
    experience: 5,
    rate: "$22/hr",
    bio: "Organized nanny experienced with infants. Strong communicator and very clean.",
    image: "https://images.pexels.com/photos/6623896/pexels-photo-6623896.jpeg",
    reviews: ["Great with babies!", "Super dependable."],
    timeAvailability: "12pm - 6pm",
    availableDays: ["Tue", "Thu", "Sat"],
  },
];

const NannyFindPage = () => {
  const query = useQuery();
  const selectedTime = query.get("timeRange");
  const selectedDays = query.getAll("days");

  const [nannies, setNannies] = useState(mockNannies);
  const [activeReviewIndex, setActiveReviewIndex] = useState(null);
  const [reviewInput, setReviewInput] = useState("");
  const [contactNanny, setContactNanny] = useState(null);

  const filtered = nannies.filter((nanny) => {
    const timeMatch = !selectedTime || nanny.timeAvailability === selectedTime;
    const daysMatch =
      selectedDays.length === 0 ||
      selectedDays.every((day) => nanny.availableDays.includes(day));
    return timeMatch && daysMatch;
  });

  const handleAddReview = (index) => {
    if (reviewInput.trim()) {
      const updated = [...nannies];
      updated[index].reviews.push(reviewInput.trim());
      setNannies(updated);
      setReviewInput("");
      setActiveReviewIndex(null);
    }
  };

  return (
    <Container maxW="6xl" py={10}>
      <Box bg="white" _dark={{ bg: "gray.800", color: "white" }} p={8} borderRadius="lg" boxShadow="lg">
        <Heading size="lg" mb={6} color="blue.500">
          Matching Nannies
        </Heading>

        {filtered.length === 0 ? (
          <Text>No nannies found for your filters.</Text>
        ) : (
          filtered.map((nanny, idx) => (
            <Box key={idx} borderBottom="1px solid lightgray" pb={8} mb={8}>
              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={10}>
                {/* Info */}
                <VStack spacing={2} align="start">
                  <Text><b>First Name:</b> {nanny.firstName}</Text>
                  <Text><b>Last Name:</b> {nanny.lastName}</Text>
                  <Text><b>Age:</b> {nanny.age}</Text>
                  <Text><b>License:</b> {nanny.license}</Text>
                  <Text><b>Address:</b> {nanny.address}</Text>
                  <Text><b>Experience:</b> {nanny.experience} year(s)</Text>
                  <Text><b>Rate:</b> {nanny.rate}</Text>
                  <Text><b>Available Time:</b> {nanny.timeAvailability}</Text>
                  <Text><b>Available Days:</b> {nanny.availableDays.join(", ")}</Text>
                  <Box>
                    <Text fontWeight="bold">Bio:</Text>
                    <Text>{nanny.bio}</Text>
                  </Box>
                </VStack>

                {/* Image + Reviews */}
                <VStack spacing={4} align="center">
                  {nanny.image ? (
                    <Image
                      src={nanny.image}
                      alt="Nanny"
                      boxSize="200px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  ) : (
                    <Box
                      boxSize="200px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      border="1px dashed gray"
                      borderRadius="md"
                    >
                      <Text color="gray.400">No image</Text>
                    </Box>
                  )}

                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() =>
                      setActiveReviewIndex(
                        activeReviewIndex === idx ? null : idx
                      )
                    }
                  >
                    Add a review
                  </Button>

                  {activeReviewIndex === idx && (
                    <Box w="full">
                      <Input
                        placeholder="Write your review"
                        value={reviewInput}
                        onChange={(e) => setReviewInput(e.target.value)}
                        mb={2}
                      />
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => handleAddReview(idx)}
                      >
                        Submit
                      </Button>
                    </Box>
                  )}

                  <Box w="full">
                    <Text fontWeight="bold">Reviews:</Text>
                    <VStack align="start" spacing={1} mt={2}>
                      {nanny.reviews.map((review, i) => (
                        <Box
                          key={i}
                          p={2}
                          bg="gray.100"
                          _dark={{ bg: "gray.700" }}
                          borderRadius="md"
                          w="full"
                        >
                          <Text fontSize="sm">⭐ {review}</Text>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              </Grid>

              <Flex justify="center" mt={6}>
                <Button
                  colorScheme="green"
                  size="md"
                  onClick={() => setContactNanny(nanny)}
                  bg="green.500"
                  color="white"
                  _dark={{ bg: "green.400", color: "black" }}
                >
                  Contact Now
                </Button>
              </Flex>

              {contactNanny === nanny && (
                <Flex justify="center" mt={4}>
                  <Box
                    bg="gray.100"
                    _dark={{ bg: "gray.700" }}
                    p={3}
                    borderRadius="md"
                    textAlign="center"
                  >
                    <Text fontSize="md" fontWeight="medium">
                      📞 +1 (236)-800-0000
                    </Text>
                  </Box>
                </Flex>
              )}
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default NannyFindPage;
