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
import { useNavigate } from "react-router-dom";

// Days with unique labels
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

export const NannySearchPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [childAge, setChildAge] = useState("");
  const [minPrice, setMinPrice] = useState(15);
  const [maxPrice, setMaxPrice] = useState(35);
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeRange, setTimeRange] = useState("");

  const toggleDay = (value) => {
    setSelectedDays((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };
                 //Atleast a day must be selected and a time-range must be slected to show the matching nanny
  const handleSearch = () => {
    const sanitizedMin = Math.max(0, minPrice);
    const sanitizedMax = Math.max(sanitizedMin, maxPrice);
  
    // ✅ Validation: timeRange is required
    if (!timeRange) {
      alert("Please select a time range.");
      return;
    }
  
    if (selectedDays.length === 0) {
      alert("Please select at least one available day.");
      return;
    }

    if (Number(childAge) < 0) {
      alert("Child age must be 0 or greater.");
      return;
    }
    
  
    // Log for now (can send to backend later)
    console.log({
      location,
      childAge,
      minPrice: sanitizedMin,
      maxPrice: sanitizedMax,
      selectedDays,
      timeRange,
    });
  
    onClose();
  
    // Pass filters via query string
    navigate(
      `/nanny-find?timeRange=${encodeURIComponent(timeRange)}${selectedDays
        .map((day) => `&days=${encodeURIComponent(day)}`)
        .join("")}`
    );
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
      bg="blackAlpha.400"
      zIndex={999}
      onClick={handleOutsideClick}
    >
      <Box
        position="absolute"
        top="10%"
        left="50%"
        transform="translateX(-50%)"
        bg="white"
        color="black"
        _dark={{ bg: "white", color: "black" }}
        p={6}
        borderRadius="md"
        boxShadow="lg"
        zIndex={1000}
        minW="350px"
      >
        <VStack spacing={4} align="start">
          <Text fontWeight="bold" fontSize="lg">
            Search for Babysitter
          </Text>

          <Input
            placeholder="Where do you need a nanny?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            bg="white"
            color="black"
          />

          <Input
            placeholder="What's the age of your child?"
            type="number"
            min={0} // ✅ Prevent negatives via HTML
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
            bg="white"
            color="black"
          />


          <Box w="full">
            <Text mb={2}>Price Range ($)</Text>
            <HStack>
              <Box>
                <Text fontSize="sm">Min</Text>
                <Input
                  type="number"
                  size="sm"
                  width="80px"
                  min={0}
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(Math.max(0, Number(e.target.value)))
                  }
                  bg="white"
                  color="black"
                />
              </Box>

              <Box>
                <Text fontSize="sm">Max</Text>
                <Input
                  type="number"
                  size="sm"
                  width="80px"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(Math.max(minPrice, Number(e.target.value)))
                  }
                  bg="white"
                  color="black"
                />
              </Box>
            </HStack>
          </Box>

          <Box w="full">
            <Text mb={1}>Days:</Text>
            <Wrap spacing={2}>
              {dayOptions.map(({ label, value }) => (
                <WrapItem key={value}>
                  <Button
                    size="sm"
                    bg={selectedDays.includes(value) ? "blue.500" : "white"}
                    color={selectedDays.includes(value) ? "white" : "black"}
                    _hover={{ bg: "blue.100" }}
                    border="1px solid"
                    borderColor="gray.300"
                    onClick={() => toggleDay(value)}
                  >
                    {label}
                  </Button>
                </WrapItem>
              ))}
            </Wrap>
          </Box>

          <Box w="full">
            <Text mb={1}>Time Range:</Text>
            <HStack spacing={2} flexWrap="wrap">
              {timeOptions.map((option, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  bg={timeRange === option ? "blue.500" : "white"}
                  color={timeRange === option ? "white" : "black"}
                  _hover={{ bg: "blue.100" }}
                  border="1px solid"
                  borderColor="gray.300"
                  onClick={() => setTimeRange(option)}
                >
                  {option}
                </Button>
              ))}
            </HStack>
          </Box>

          <HStack w="full" justify="flex-end" pt={2}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSearch}>
              Search
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};
