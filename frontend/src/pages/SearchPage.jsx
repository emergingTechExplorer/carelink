import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    Flex,
    Grid,
    Heading,
    Image,
    Text,
    VStack,
    Input,
} from "@chakra-ui/react";
import { babysitterService } from "@/services/babySitterService.js";
import { reviewService } from "@/services/reviewService.js";
import { NannySearchPopup } from "../components/NannySearchPopup";

export default function SearchPage() {
    const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
    const [nannies, setNannies] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [selectedNanny, setSelectedNanny] = useState(null);
    const [reviewInput, setReviewInput] = useState("");
    const [isPhoneVisible, setIsPhoneVisible] = useState(false);
    const [isSearched, setIsSearched] = useState(false);

    useEffect(() => {
        const fetchAllBabysitters = async () => {
            try {
                const response = await babysitterService.getAllBabysitters();
                const babysitters = response.results || [];
                const mapped = formatNannies(babysitters);
                setNannies(mapped);
                const distinctLocations = new Set(
                    babysitters.map((b) => b.location).filter(Boolean)
                );
                setLocationOptions([...distinctLocations]);
            } catch (error) {
                console.error("Error fetching all babysitters:", error);
            }
        };
        fetchAllBabysitters();
    }, []);

    const formatNannies = (babysitters) => {
        if (!babysitters) return [];
        return babysitters.map((b) => ({
            id: b.userId,
            firstName: b.firstName || "N/A",
            lastName: b.lastName || "N/A",
            age: b.age?.toString() || "N/A",
            phone: b.phone || "",
            address: b.address || "No address provided",
            qualifications: b.qualifications || "N/A",
            experience: b.experienceInYears || 0,
            rate: b.hourlyRate ? `$${b.hourlyRate}/hr` : "N/A",
            bio: b.bio || "",
            image: b.profileImageUrl || "",
            timeAvailability: b.availabilityTimeRange || "",
            availableDays: b.availabilityDays || [],
            license: b.licenseNumber || "No License #",
            location: b.location || "N/A",

            reviews: b.reviews?.map((r) => r.comment || "") || [],
        }));
    };

    const handleCardClick = (nanny) => {
        setSelectedNanny(nanny);
        setReviewInput("");
        setIsPhoneVisible(false); // Reset
    };

    const handleCloseDetails = () => {
        setSelectedNanny(null);
        setReviewInput("");
        setIsPhoneVisible(false);
    };

    const handleAddReview = async () => {
        if (!reviewInput.trim() || !selectedNanny) return;
        try {
            await reviewService.addReview({
                babysitterId: selectedNanny.id,
                rating: 5,
                comment: reviewInput.trim(),
            });

            const updatedReviews = [...selectedNanny.reviews, reviewInput.trim()];
            const updatedNanny = { ...selectedNanny, reviews: updatedReviews };
            setSelectedNanny(updatedNanny);

            setNannies((prev) =>
                prev.map((n) => (n.id === selectedNanny.id ? updatedNanny : n))
            );

            setReviewInput("");
            alert("Review posted successfully!");
        } catch (err) {
            console.error("Error posting review:", err);
            alert("Failed to post review. See console for details.");
        }
    };

    const handleSearchComplete = (searchResponse) => {
        if (!searchResponse || !searchResponse.results) return;
        setNannies(formatNannies(searchResponse.results));
        setIsSearched(true);
    };

    return (
        <Box minH="100vh" p={8}>
            <NannySearchPopup
                isOpen={isSearchPopupOpen}
                onClose={() => setIsSearchPopupOpen(false)}
                onSearchComplete={handleSearchComplete}
                locationOptions={locationOptions}
            />

            <Container maxW="7xl" py={4}>
                <Flex justify="flex-end" mb={4}>
                    <Button colorScheme="blue" onClick={() => setIsSearchPopupOpen(true)}>
                        Search Filters
                    </Button>
                </Flex>

                { isSearched && <Heading size="lg" mb={6} color="blue.500">
                    Matching Nannies
                </Heading>}

                {nannies.length === 0 ? (
                    <Text>No nannies found.</Text>
                ) : (
                    <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
                        {nannies.map((nanny, idx) => (
                            <Box
                                key={idx}
                                p={5}
                                borderRadius="lg"
                                boxShadow="md"
                                borderWidth="1px"
                                borderColor="gray.200"
                                transition="all 0.2s"
                                _hover={{ boxShadow: "xl", transform: "scale(1.02)", cursor: "pointer" }}
                                onClick={() => handleCardClick(nanny)}
                            >
                                <VStack spacing={3} align="start">
                                    {/* Image */}
                                    <Box alignSelf="center">
                                        {nanny.image ? (
                                            <Image
                                                src={nanny.image}
                                                alt="Nanny"
                                                boxSize="150px"
                                                objectFit="cover"
                                                borderRadius="md"
                                            />
                                        ) : (
                                            <Box
                                                boxSize="150px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                border="1px dashed gray"
                                                borderRadius="md"
                                            >
                                                <Text color="gray.400">No image</Text>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Basic details */}
                                    <Box>
                                        <Text fontWeight="bold" fontSize="md">
                                            {nanny.firstName} {nanny.lastName}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {nanny.address}
                                        </Text>
                                    </Box>

                                    <Text fontWeight="semibold" color="blue.500">
                                        {nanny.rate}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        Click to view details
                                    </Text>
                                </VStack>
                            </Box>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Overlay with details & add review */}
            {selectedNanny && (
                <Box
                    id="overlay"
                    position="fixed"
                    top="0"
                    left="0"
                    w="100vw"
                    h="100vh"
                    bg="blackAlpha.800"
                    zIndex="999"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    animation="fadeIn 0.3s"
                    onClick={(e) => {
                        if (e.target.id === "overlay") handleCloseDetails();
                    }}
                    sx={{
                        "@keyframes fadeIn": {
                            from: { opacity: 0 },
                            to: { opacity: 1 },
                        },
                    }}
                >
                    <Box
                        p={6}
                        borderRadius="lg"
                        boxShadow="dark-lg"
                        maxW="600px"
                        w="90%"
                        maxH="80vh"
                        overflowY="auto"
                        bg="linear-gradient(150deg, #1A202C 30%, #2D3748 100%)"
                        color="white"
                        border="1px solid #444"
                        onClick={(e) => e.stopPropagation()}
                        animation="scaleIn 0.3s"
                        sx={{
                            "@keyframes scaleIn": {
                                from: { transform: "scale(0.9)" },
                                to: { transform: "scale(1)" },
                            },
                        }}
                    >
                        <Flex justify="flex-end" mb={4}>
                            <Button
                                size="sm"
                                variant="outline"
                                color="gray.300"
                                borderColor="gray.500"
                                _hover={{ bg: "gray.700", borderColor: "gray.400" }}
                                onClick={handleCloseDetails}
                            >
                                Close
                            </Button>
                        </Flex>

                        <VStack align="start" spacing={4}>
                            {selectedNanny.image ? (
                                <Image
                                    src={selectedNanny.image}
                                    alt="Nanny"
                                    boxSize="200px"
                                    objectFit="cover"
                                    borderRadius="md"
                                    alignSelf="center"
                                    border="1px solid #444"
                                />
                            ) : (
                                <Box
                                    boxSize="200px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="1px dashed gray"
                                    borderRadius="md"
                                    alignSelf="center"
                                >
                                    <Text color="gray.400">No image</Text>
                                </Box>
                            )}

                            <Text>
                                <b>Name:</b> {selectedNanny.firstName} {selectedNanny.lastName}
                            </Text>
                            <Text>
                                <b>Age:</b> {selectedNanny.age}
                            </Text>
                            <Text>
                                <b>License:</b> {selectedNanny.license}
                            </Text>
                            <Text>
                                <b>Address:</b> {selectedNanny.address}
                            </Text>
                            <Text>
                                <b>Location:</b> {selectedNanny.location}
                            </Text>
                            <Text>
                                <b>Qualifications:</b> {selectedNanny.qualifications}
                            </Text>
                            <Text>
                                <b>Experience:</b> {selectedNanny.experience} year(s)
                            </Text>
                            <Text>
                                <b>Rate:</b> {selectedNanny.rate}
                            </Text>

                            <Text>
                                <b>Availability Time Range:</b> {selectedNanny.timeAvailability}
                            </Text>
                            <Text>
                                <b>Availability Days:</b>{" "}
                                {selectedNanny.availableDays.join(", ") || "None"}
                            </Text>

                            <Box>
                                <Text fontWeight="bold">Bio:</Text>
                                <Text>{selectedNanny.bio}</Text>
                            </Box>

                            {/* Existing Reviews */}
                            <Box w="full">
                                <Text fontWeight="bold" mb={1}>
                                    Reviews:
                                </Text>
                                {selectedNanny.reviews.length === 0 ? (
                                    <Text fontSize="sm" color="gray.400">
                                        No reviews yet.
                                    </Text>
                                ) : (
                                    selectedNanny.reviews.map((rev, i) => (
                                        <Box
                                            key={i}
                                            p={2}
                                            mt={1}
                                            borderRadius="md"
                                            bg="rgba(255, 255, 255, 0.08)"
                                            style={{ backdropFilter: "blur(5px)" }}
                                        >
                                            <Text fontSize="sm" color="gray.100">
                                                ⭐ {rev}
                                            </Text>
                                        </Box>
                                    ))
                                )}
                            </Box>

                            {/* Add new review */}
                            <Box w="full" mt={4}>
                                <Text fontWeight="bold" mb={1} color="teal.300">
                                    Add a Review
                                </Text>
                                <Flex gap={2} align="center">
                                    <Input
                                        value={reviewInput}
                                        onChange={(e) => setReviewInput(e.target.value)}
                                        placeholder="Write your review..."
                                        bg="rgba(255,255,255,0.1)"
                                        color="white"
                                        _placeholder={{ color: "gray.400" }}
                                        borderColor="gray.600"
                                        _hover={{ borderColor: "gray.500" }}
                                        _focus={{ borderColor: "teal.300" }}
                                    />
                                    <Button
                                        size="sm"
                                        colorScheme="teal"
                                        onClick={handleAddReview}
                                    >
                                        Submit
                                    </Button>
                                </Flex>
                            </Box>

                            {/* Show Contact Number Button */}
                            <Box w="full" mt={6}>
                                {!isPhoneVisible ? (
                                    <Button onClick={() => setIsPhoneVisible(true)} colorScheme="teal">
                                        Show Contact Number
                                    </Button>
                                ) : selectedNanny.phone ? (
                                    <Text>
                                        <b>Contact:</b> {selectedNanny.phone}
                                    </Text>
                                ) : (
                                    <Text>No phone on record.</Text>
                                )}
                            </Box>
                        </VStack>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
