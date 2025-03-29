import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
  Image,
  Grid,
  Flex,
  Wrap,
  WrapItem,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";

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

const NannyDetail = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    license: "",
    address: "",
    experience: "",
    rate: "",
    bio: "",
    image: "",
    selectedDays: [],
    timeRange: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDay = (value) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(value)
        ? prev.selectedDays.filter((d) => d !== value)
        : [...prev.selectedDays, value],
    }));
  };

  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      age: "",
      license: "",
      address: "",
      experience: "",
      rate: "",
      bio: "",
      image: "",
      selectedDays: [],
      timeRange: "",
    });
  };

  const handleSave = () => {
    const {
      firstName,
      lastName,
      age,
      license,
      address,
      experience,
      rate,
      bio,
      image,
      timeRange,
      selectedDays,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !age ||
      !license ||
      !address ||
      !experience ||
      !rate ||
      !bio ||
      !image ||
      !timeRange ||
      selectedDays.length === 0
    ) {
      alert("Please fill in all fields and select availability.");
      return;
    }

    if (Number(age) < 0) {
      alert("Age must be 0 or greater.");
      return;
    }

    console.log("✅ Saved:", formData);
    alert("Saved successfully! (Backend will be added later)");
  };

  const label = (text) => <Text fontWeight="bold">{text}</Text>;

  return (
    <Container maxW="6xl" py={10}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" color="black">
        <Heading size="lg" mb={6} color="blue.500">
          Edit Nanny Profile
        </Heading>

        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={10}>
          {/* Left: Form */}
          <VStack spacing={5} align="start">
            {[
              "firstName",
              "lastName",
              "age",
              "license",
              "address",
              "experience",
              "rate",
            ].map((field) => (
              <Box key={field} w="full">
                {label(field.charAt(0).toUpperCase() + field.slice(1))}
                <Input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  type={field === "age" ? "number" : "text"}
                />
              </Box>
            ))}

            {/* Days Available */}
            <Box w="full">
              {label("Days Available")}
              <Wrap spacing={2}>
                {dayOptions.map(({ label, value }, idx) => (
                  <WrapItem key={`${value}-${idx}`}>
                    <Button
                      size="sm"
                      bg={
                        formData.selectedDays.includes(value)
                          ? "blue.500"
                          : "white"
                      }
                      color={
                        formData.selectedDays.includes(value)
                          ? "white"
                          : "black"
                      }
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

            {/* Time Range */}
            <Box w="full">
              {label("Time Range")}
              <HStack spacing={2} flexWrap="wrap">
                {timeOptions.map((option, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    bg={
                      formData.timeRange === option ? "blue.500" : "white"
                    }
                    color={
                      formData.timeRange === option ? "white" : "black"
                    }
                    _hover={{ bg: "blue.100" }}
                    border="1px solid"
                    borderColor="gray.300"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        timeRange: option,
                      }))
                    }
                  >
                    {option}
                  </Button>
                ))}
              </HStack>
            </Box>

            {/* Bio */}
            <Box w="full">
              {label("Bio")}
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
              />
            </Box>
          </VStack>

          {/* Right: Image preview + input */}
          <Flex direction="column" align="center" gap={4}>
            <Box
              border="1px dashed gray"
              borderRadius="md"
              boxSize="200px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={2}
              w="200px"
            >
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt="Nanny Preview"
                  objectFit="cover"
                  boxSize="full"
                  borderRadius="md"
                />
              ) : (
                <Text color="gray.400">Paste image URL below</Text>
              )}
            </Box>
            <Input
              placeholder="Paste image URL here"
              value={formData.image}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  image: e.target.value,
                }))
              }
            />
          </Flex>
        </Grid>

        {/* Buttons */}
        <Flex justify="flex-end" mt={8} gap={4}>
          <Button onClick={handleClear} variant="outline" colorScheme="gray">
            Clear
          </Button>
          <Button onClick={handleSave} colorScheme="blue">
            Save
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default NannyDetail;
