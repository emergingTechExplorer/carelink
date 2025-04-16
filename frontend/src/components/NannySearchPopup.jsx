import {
    Box,
    Button,
    Input,
    VStack,
    Text,
    HStack,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import { useState } from "react";
import { babysitterService } from "@/services/babySitterService";

const dayEnumMap = {
    Mon: "MONDAY",
    Tue: "TUESDAY",
    Wed: "WEDNESDAY",
    Thu: "THURSDAY",
    Fri: "FRIDAY",
    Sat: "SATURDAY",
    Sun: "SUNDAY",
};

const dayOptions = [
    { label: "M", value: "Mon" },
    { label: "T", value: "Tue" },
    { label: "W", value: "Wed" },
    { label: "T", value: "Thu" },
    { label: "F", value: "Fri" },
    { label: "S", value: "Sat" },
    { label: "S", value: "Sun" },
];

const timeOptions = ["7am - 12pm", "12pm - 6pm", "Full day"];

export const NannySearchPopup = ({
                                     isOpen,
                                     onClose,
                                     onSearchComplete,
                                     locationOptions = [],
                                 }) => {
    const [location, setLocation] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(50);
    const [selectedDays, setSelectedDays] = useState([]);
    const [timeRange, setTimeRange] = useState("");

    const toggleDay = (value) => {
        setSelectedDays((prev) =>
            prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
        );
    };

    const handleSearch = async () => {
        const sanitizedMin = Math.max(0, minPrice);
        const sanitizedMax = Math.max(sanitizedMin, maxPrice);
        const dayEnums = selectedDays.map((d) => dayEnumMap[d]);

        let mappedTime;
        if (timeRange === "Full day") mappedTime = "FULL_DAY";
        else if (timeRange === "7am - 12pm") mappedTime = "HALF_DAY_MORNING";
        else if (timeRange === "12pm - 6pm") mappedTime = "HALF_DAY_EVENING";

        const requestBody = {
            minRate: sanitizedMin,
            maxRate: sanitizedMax,
            availableDays: dayEnums,
            timeSlot: mappedTime,
            location: location || null,
        };

        try {
            const response = await babysitterService.searchBabysitters(requestBody);
            if (onSearchComplete) onSearchComplete(response);
            onClose();
        } catch (err) {
            console.error("Search error:", err);
            alert("Error searching babysitters. See console for details.");
        }
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === "popupOverlay") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <Box
            id="popupOverlay"
            position="fixed"
            top="0"
            left="0"
            w="100vw"
            h="100vh"
            bg="blackAlpha.600"
            zIndex={999}
            onClick={handleOutsideClick}
        >
            <Box
                position="absolute"
                top="10%"
                left="50%"
                transform="translateX(-50%)"
                p={6}
                borderRadius="md"
                boxShadow="lg"
                zIndex={1000}
                minW="350px"
                maxW="90vw"
                bg="white"
                color="gray.800"
                borderWidth="1px"
                borderColor="gray.200"
                _dark={{
                    bg: "gray.800",
                    color: "white",
                    borderColor: "gray.700",
                }}
            >
                <VStack spacing={4} align="start" w="full">
                    <Text fontWeight="bold" fontSize="lg" color="teal.500" _dark={{ color: "teal.300" }}>
                        Search for Babysitter
                    </Text>

                    <Box w="full">
                        <Text mb={1} color="teal.500" _dark={{ color: "teal.300" }}>
                            Location
                        </Text>
                        <Box
                            as="select"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            borderWidth="1px"
                            borderColor="gray.200"
                            borderRadius="md"
                            px={2}
                            py={1}
                            w="full"
                            _hover={{ borderColor: "teal.400" }}
                            _focus={{ borderColor: "teal.400" }}
                            _dark={{
                                bg: "gray.700",
                                borderColor: "gray.600",
                                _hover: { borderColor: "teal.400" },
                                _focus: { borderColor: "teal.400" },
                            }}
                        >
                            <option value="">All locations</option>
                            {locationOptions.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </Box>
                    </Box>

                    <Box w="full">
                        <Text mb={2} color="teal.500" _dark={{ color: "teal.300" }}>
                            Hourly Rate ($)
                        </Text>
                        <HStack>
                            <Box>
                                <Text fontSize="sm" mb={1}>Min</Text>
                                <Input
                                    type="number"
                                    size="sm"
                                    width="80px"
                                    min={0}
                                    value={minPrice}
                                    onChange={(e) =>
                                        setMinPrice(Math.max(0, Number(e.target.value)))
                                    }
                                    borderColor="gray.200"
                                    _hover={{ borderColor: "teal.400" }}
                                    _focus={{ borderColor: "teal.400" }}
                                    _dark={{
                                        bg: "gray.700",
                                        borderColor: "gray.600",
                                        _hover: { borderColor: "teal.400" },
                                        _focus: { borderColor: "teal.400" },
                                    }}
                                />
                            </Box>

                            <Box>
                                <Text fontSize="sm" mb={1}>Max</Text>
                                <Input
                                    type="number"
                                    size="sm"
                                    width="80px"
                                    value={maxPrice}
                                    onChange={(e) =>
                                        setMaxPrice(Math.max(minPrice, Number(e.target.value)))
                                    }
                                    borderColor="gray.200"
                                    _hover={{ borderColor: "teal.400" }}
                                    _focus={{ borderColor: "teal.400" }}
                                    _dark={{
                                        bg: "gray.700",
                                        borderColor: "gray.600",
                                        _hover: { borderColor: "teal.400" },
                                        _focus: { borderColor: "teal.400" },
                                    }}
                                />
                            </Box>
                        </HStack>
                    </Box>

                    <Box w="full">
                        <Text mb={1} color="teal.500" _dark={{ color: "teal.300" }}>Days:</Text>
                        <Wrap spacing={2}>
                            {dayOptions.map(({ label, value }) => {
                                const isActive = selectedDays.includes(value);
                                return (
                                    <WrapItem key={value}>
                                        <Button
                                            size="sm"
                                            color="gray.800"
                                            bg={isActive ? "teal.400" : "gray.200"}
                                            _hover={{ bg: isActive ? "teal.500" : "gray.300" }}
                                            _dark={{
                                                color: "white",
                                                bg: isActive ? "teal.500" : "gray.700",
                                                _hover: { bg: isActive ? "teal.400" : "gray.600" },
                                                borderColor: "gray.600",
                                            }}
                                            borderWidth="1px"
                                            borderColor="gray.200"
                                            onClick={() => toggleDay(value)}
                                        >
                                            {label}
                                        </Button>
                                    </WrapItem>
                                );
                            })}
                        </Wrap>
                    </Box>

                    <Box w="full">
                        <Text mb={1} color="teal.500" _dark={{ color: "teal.300" }}>Time Range:</Text>
                        <HStack spacing={2} flexWrap="wrap">
                            {timeOptions.map((option, idx) => {
                                const isActive = timeRange === option;
                                return (
                                    <Button
                                        key={idx}
                                        size="sm"
                                        color="gray.800"
                                        bg={isActive ? "teal.400" : "gray.200"}
                                        _hover={{ bg: isActive ? "teal.500" : "gray.300" }}
                                        _dark={{
                                            color: "white",
                                            bg: isActive ? "teal.500" : "gray.700",
                                            _hover: { bg: isActive ? "teal.400" : "gray.600" },
                                            borderColor: "gray.600",
                                        }}
                                        borderWidth="1px"
                                        borderColor="gray.200"
                                        onClick={() => setTimeRange(timeRange === option ? "" : option)}
                                    >
                                        {option}
                                    </Button>
                                );
                            })}
                        </HStack>
                    </Box>

                    <HStack w="full" justify="flex-end" pt={2}>
                        <Button
                            variant="outline"
                            size="sm"
                            color="gray.800"
                            borderColor="gray.200"
                            _hover={{ bg: "gray.100" }}
                            _dark={{
                                color: "white",
                                borderColor: "gray.600",
                                _hover: { bg: "gray.700" },
                            }}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button colorScheme="teal" size="sm" onClick={handleSearch}>
                            Search
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    );
};
