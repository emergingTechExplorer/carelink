import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Image,
    Input,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";
import { babysitterService } from "@/services/babySitterService.js";
import { reviewService } from "@/services/reviewService.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

const timeSlotOptions = [
    { label: "Full Day", value: "FULL_DAY" },
    { label: "Half Day (Morning)", value: "HALF_DAY_MORNING" },
    { label: "Half Day (Evening)", value: "HALF_DAY_EVENING" },
];

const weekDayOptions = [
    { label: "Monday", value: "MONDAY" },
    { label: "Tuesday", value: "TUESDAY" },
    { label: "Wednesday", value: "WEDNESDAY" },
    { label: "Thursday", value: "THURSDAY" },
    { label: "Friday", value: "FRIDAY" },
    { label: "Saturday", value: "SATURDAY" },
    { label: "Sunday", value: "SUNDAY" },
];

export default function BabysitterEditPage() {
    const [reviews, setReviews] = useState([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const babysitterId = user.id;
    const [uploading, setUploading] = useState(false); // Show upload progress/spinner if needed

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        phone: "",
        address: "",
        qualifications: "",
        experienceInYears: "",
        hourlyRate: "",
        availabilityDays: [],
        availabilityTimeRange: "",
        bio: "",
        licenseNumber: "",
        profileImageUrl: "",
        location: "",
    });

    useEffect(() => {
        async function fetchBabysitter() {
            try {
                if (!babysitterId) return;
                const rsp = await babysitterService.getBabysitterById(babysitterId);
                const data = rsp.results[0];

                setFormData({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: data.age,
                    phone: data.phone || "",
                    address: data.address || "",
                    qualifications: data.qualifications || "",
                    experienceInYears: data.experienceInYears?.toString() || "",
                    hourlyRate: data.hourlyRate?.toString() || "",
                    availabilityDays: data.availabilityDays || [],
                    availabilityTimeRange: data.availabilityTimeRange || "",
                    bio: data.bio || "",
                    licenseNumber: data.licenseNumber || "",
                    profileImageUrl: data.profileImageUrl || "",
                    location: data.location || "",
                });
            } catch (err) {
                console.error("Error fetching babysitter:", err);
            }
        }
        fetchBabysitter();
    }, [babysitterId, user.firstName, user.lastName]);

    useEffect(() => {
        async function fetchReviews() {
            try {
                if (!babysitterId) return;
                const rsp = await reviewService.getReviewsByBabysitterId(babysitterId);
                const data = rsp.results;
                setReviews(data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        }
        fetchReviews();
    }, [babysitterId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDayToggle = (dayValue) => {
        setFormData((prev) => {
            const days = [...prev.availabilityDays];
            return days.includes(dayValue)
                ? { ...prev, availabilityDays: days.filter((d) => d !== dayValue) }
                : { ...prev, availabilityDays: [...days, dayValue] };
        });
    };

    const handleImageUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);

        try {
            const file = e.target.files[0];
            const imageRef = ref(storage, `profile-images/${babysitterId}/${file.name}`);
            const uploadTask = uploadBytesResumable(imageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Optional: track progress, e.g.:
                    // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    console.error("Upload error:", error);
                    alert("Error uploading image. See console for details.");
                    setUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setFormData((prev) => ({ ...prev, profileImageUrl: downloadURL }));
                    setUploading(false);
                    alert("Image uploaded successfully!");
                }
            );
        } catch (err) {
            console.error("Error uploading image:", err);
            alert("Error uploading image. See console for details.");
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Make sure at least one availability day is selected:
        if (formData.availabilityDays.length === 0) {
            alert("Please select at least one availability day.");
            return;
        }

        try {
            const patchData = {
                age: formData.age,
                phone: formData.phone,
                address: formData.address,
                qualifications: formData.qualifications,
                experienceInYears: formData.experienceInYears
                    ? Number(formData.experienceInYears)
                    : null,
                hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
                availabilityDays: formData.availabilityDays,
                availabilityTimeRange: formData.availabilityTimeRange,
                bio: formData.bio,
                licenseNumber: formData.licenseNumber,
                profileImageUrl: formData.profileImageUrl, // This is our new Firebase URL
                location: formData.location,
            };

            const updated = await babysitterService.updateBabysitter(babysitterId, patchData);
            console.log("Updated babysitter:", updated);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating babysitter:", err);
            alert("Error updating babysitter details. See console for more info.");
        }
    };

    // Must be logged in
    if (!user || !user.token) {
        return (
            <Box minH="100vh" p={8}>
                <Container maxW="md" py={10}>
                    <Heading size="md" mb={4}>
                        You must be logged in to edit this page.
                    </Heading>
                </Container>
            </Box>
        );
    }

    // Restrict to babysitters only
    if (user.role !== "BABYSITTER") {
        return (
            <Box minH="100vh" p={8}>
                <Container maxW="md" py={10}>
                    <Heading size="md" mb={4} color="red.500">
                        Access Denied
                    </Heading>
                    <Text>You must be a babysitter to view this page.</Text>
                </Container>
            </Box>
        );
    }

    return (
        <Box minH="100vh" p={8} width="100%">
            <Container maxW="75vw" py={8}>
                <Heading size="xl" mb={6} color="blue.500">
                    Edit Babysitter Profile
                </Heading>

                <Box
                    p={6}
                    borderRadius="lg"
                    boxShadow="xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                    _dark={{ borderColor: "gray.700" }}
                >
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={5} align="stretch">
                            {/* First Name */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    First Name
                                </Text>
                                <Input
                                    placeholder=""
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                    disabled
                                />
                            </Box>

                            {/* Last Name */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    Last Name
                                </Text>
                                <Input
                                    placeholder=""
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                    disabled
                                />
                            </Box>

                            {/* Age */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    Age
                                </Text>
                                <Input
                                    placeholder="Enter your age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                />
                            </Box>

                            {/* Phone */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    Phone
                                </Text>
                                <Input
                                    placeholder="Enter your phone number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                    required
                                />
                            </Box>

                            {/* Address */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    Address
                                </Text>
                                <Input
                                    placeholder="Enter your address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                />
                            </Box>

                            {/* Qualifications */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    Qualifications
                                </Text>
                                <Input
                                    placeholder="Any certifications or skills?"
                                    name="qualifications"
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                />
                            </Box>

                            {/* Experience */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    Experience (years)
                                </Text>
                                <Input
                                    type="number"
                                    placeholder="How many years of experience?"
                                    name="experienceInYears"
                                    value={formData.experienceInYears}
                                    onChange={handleChange}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                    required
                                    min="0"
                                    step="1"
                                />
                            </Box>

                            {/* Hourly Rate */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    Hourly Rate
                                </Text>
                                <Input
                                    type="number"
                                    placeholder="e.g. 20"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                    required
                                    min="0"
                                    step="1"
                                />
                            </Box>

                            {/* Availability Days */}
                            <Box>
                                <Text mb={2} fontWeight="medium">
                                    Availability Days
                                </Text>
                                <HStack spacing={3} wrap="wrap">
                                    {weekDayOptions.map((day) => (
                                        <Box key={day.value}>
                                            <label style={{ cursor: "pointer" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.availabilityDays.includes(day.value)}
                                                    onChange={() => handleDayToggle(day.value)}
                                                    style={{ marginRight: "4px", cursor: "pointer" }}
                                                />
                                                {day.label}
                                            </label>
                                        </Box>
                                    ))}
                                </HStack>
                            </Box>

                            {/* Availability Time Range */}
                            <Box>
                                <Text mb={2} fontWeight="medium">
                                    Availability Time Range
                                </Text>
                                <select
                                    name="availabilityTimeRange"
                                    value={formData.availabilityTimeRange}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "8px",
                                        borderRadius: "6px",
                                        border: "1px solid",
                                        borderColor: "gray.200",
                                        cursor: "pointer",
                                    }}
                                >
                                    <option value="">Select Time Slot</option>
                                    {timeSlotOptions.map((slot) => (
                                        <option key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </option>
                                    ))}
                                </select>
                            </Box>

                            {/* Bio */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    Bio
                                </Text>
                                <Textarea
                                    placeholder="Tell parents about yourself!"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                    rows={5}
                                />
                            </Box>

                            {/* License Number */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    License Number
                                </Text>
                                <Input
                                    placeholder="Optional license/certification number"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                    required
                                />
                            </Box>

                            {/* Profile Image (Preview + Upload) */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    Profile Image
                                </Text>

                                {formData.profileImageUrl ? (
                                    <Box mb={3}>
                                        <Text fontSize="sm" color="gray.600">
                                            Current Image Preview:
                                        </Text>
                                        <Image
                                            src={formData.profileImageUrl}
                                            alt="Profile Preview"
                                            boxSize="150px"
                                            objectFit="cover"
                                            borderRadius="full"
                                            mt={2}
                                            mb={2}
                                        />
                                        <Text fontSize="sm" color="gray.500">
                                            If you wish to change, simply upload a new one:
                                        </Text>
                                    </Box>
                                ) : (
                                    <Text fontSize="sm" color="gray.500" mb={3}>
                                        You currently have no profile picture. Please upload one below:
                                    </Text>
                                )}

                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                />

                                {uploading && (
                                    <Text fontSize="sm" color="orange.400" mt={1}>
                                        Uploading...
                                    </Text>
                                )}
                            </Box>

                            {/* Location */}
                            <Box>
                                <Text mb={1} fontWeight="medium">
                                    Location
                                </Text>
                                <Input
                                    placeholder="City or area you cover"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    variant="filled"
                                    focusBorderColor="teal.400"
                                    required
                                />
                            </Box>

                            <Button
                                type="submit"
                                colorScheme="teal"
                                size="lg"
                                mt={4}
                                _hover={{ bg: "teal.500", transform: "scale(1.02)" }}
                                transition="all 0.2s"
                                isDisabled={uploading} // disable while uploading to avoid conflicts
                            >
                                Save Changes
                            </Button>
                        </VStack>
                    </form>
                </Box>
            </Container>

            {/* Review Section */}
            <Container maxW="75vw" py={8}>
                <Heading size="md" mb={4}>
                    Your Reviews
                </Heading>

                {reviews.length === 0 ? (
                    <Text>No reviews yet.</Text>
                ) : (
                    <VStack spacing={4} align="stretch">
                        {reviews.map((review) => (
                            <Box
                                key={review.id}
                                p={4}
                                borderWidth="1px"
                                borderColor="gray.200"
                                borderRadius="md"
                                boxShadow="sm"
                                _dark={{ borderColor: "gray.700" }}
                            >
                                <HStack justify="space-between" mb={2}>
                                    <Text fontWeight="bold">Rating: {review.rating} / 5</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {review.reviewDate}
                                    </Text>
                                </HStack>
                                <Text fontSize="sm" mb={2}>
                                    {review.comment}
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                    Reviewed by: {review.parentName}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                )}
            </Container>
        </Box>
    );
}
