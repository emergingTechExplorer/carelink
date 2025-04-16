import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { babysitterService } from "@/services/babySitterService.js";
import { reviewService } from "@/services/reviewService.js"; // <-- Import your review service

const useQuery = () => new URLSearchParams(useLocation().search);

const dayMap = {
  Mon: "MONDAY",
  Tue: "TUESDAY",
  Wed: "WEDNESDAY",
  Thu: "THURSDAY",
  Fri: "FRIDAY",
  Sat: "SATURDAY",
  Sun: "SUNDAY",
};

const timeMap = {
  "Full day": "FULL_DAY",
  "7am - 12pm": "MORNING",
  "12pm - 6pm": "AFTERNOON",
};

const NannyFindPage = () => {
  const query = useQuery();
  const selectedTime = query.get("timeRange"); // "Full day", "7am - 12pm", etc.
  const selectedDays = query.getAll("days");   // e.g. ["Mon", "Wed"]

  const [nannies, setNannies] = useState([]);
  const [activeReviewIndex, setActiveReviewIndex] = useState(null);
  const [reviewInput, setReviewInput] = useState("");
  const [contactNanny, setContactNanny] = useState(null);

  useEffect(() => {
    const fetchBabysitters = async () => {
      try {
        const response = await babysitterService.getAllBabysitters();
        const babysitters = response.results;
        console.log("Babysitter",babysitters);
        const formatted = babysitters.map((b) => ({
          id: b.userId, // <--- Make sure your backend returns 'id'
          firstName: b.firstName || "N/A",
          lastName: b.lastName || "N/A",
          age: "N/A",
          license: b.licenseNumber || "No License #",
          address: b.address || "No address provided",
          experience: b.experienceInYears || 0,
          rate: b.hourlyRate ? `$${b.hourlyRate}/hr` : "N/A",
          bio: b.bio || "",
          image: b.profileImageUrl || "",
          timeAvailability: b.availabilityTimeRange || "",
          availableDays: b.availabilityDays || [],
          reviews: b.reviews?.map((r) => r.comment || "") || [],
          phone: b.phone || "",
        }));

        setNannies(formatted);
      } catch (error) {
        console.error("Error fetching babysitters:", error);
      }
    };

    fetchBabysitters().then(r => {
      console.log("Fetched babysitters:", r);
    }).catch(e => {
      console.error("Error fetching babysitters:", e);
    });
  }, []);

  // Convert user-friendly strings to your server's enumerations
  const serverTime = timeMap[selectedTime] || "";
  const serverDays = selectedDays.map((d) => dayMap[d]);

  // Filter the nannies based on time/day
  const filtered = nannies.filter((nanny) => {
    const timeMatch = !serverTime || nanny.timeAvailability === serverTime;
    const daysMatch =
        serverDays.length === 0 ||
        serverDays.every((sd) => nanny.availableDays.includes(sd));
    return timeMatch && daysMatch;
  });

  // Post the review to the backend and update local state
  const handleAddReview = async (index) => {
    const nanny = nannies[index];
    const comment = reviewInput.trim();
    if (!comment) return;

    try {
      // For now, use rating=5, or your desired rating.
      // If you have a rating input, pass that instead.
      await reviewService.addReview({
        babysitterId: nanny.id,
        rating: 5,
        comment,
      });

      // If successful, also update the local array so user sees it instantly
      const updated = [...nannies];
      updated[index].reviews.push(comment);
      setNannies(updated);

      setReviewInput("");
      setActiveReviewIndex(null);
      alert("Review posted successfully!");
    } catch (err) {
      console.error("Error posting review:", err);
      alert("Failed to post review. See console for details.");
    }
  };

  return (
      <Container maxW="6xl" py={10}>
        <Box
            bg="white"
            _dark={{ bg: "gray.800", color: "white" }}
            p={8}
            borderRadius="lg"
            boxShadow="lg"
        >
          <Heading size="lg" mb={6} color="blue.500">
            Matching Nannies
          </Heading>

          {filtered.length === 0 ? (
              <Text>No nannies found for your filters.</Text>
          ) : (
              filtered.map((nanny, idx) => (
                  <Box key={idx} borderBottom="1px solid lightgray" pb={8} mb={8}>
                    <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={10}>
                      {/* Left column: nanny details */}
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

                      {/* Right column: image + reviews */}
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

                        {/* Button to show/hide review input */}
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() =>
                                setActiveReviewIndex(activeReviewIndex === idx ? null : idx)
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

                    {/* Contact button */}
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
                              {nanny.phone ? `📞 ${nanny.phone}` : "No phone on record"}
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
