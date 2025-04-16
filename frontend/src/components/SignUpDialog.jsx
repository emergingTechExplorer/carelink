"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from "./ui/dialog";
import {
  Button,
  Input,
  VStack,
  Text,
  createListCollection,
  Select,
} from "@chakra-ui/react";

import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";

const frameworks = createListCollection({
  items: [
    { label: "As Parent", value: "PARENT" },
    { label: "As Babysitter", value: "BABYSITTER" },
  ],
});

const SignUpDialog = () => {
  const { setUser } = useAuthStore();

  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be 8 or more characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (roleValue) => {
    setFormData((prev) => ({
      ...prev,
      role: roleValue,
    }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Inside the handle submit function");
    setIsLoading(true);
    try {
      const response = await authService.signup(formData);
      setUser(response);
      alert("Sign-up successful! Welcome to CareLink!");
      // Only close the dialog on success
      document.querySelector("[data-dialog-close]")?.click();
      window.location.reload();
    } catch (error) {
      // Extract error message from error.results if available
      let errMsg = error.message || "Error signing up";
      if (error.results && Array.isArray(error.results) && error.results[0]?.message) {
        errMsg = error.results[0].message;
      }
      alert(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>Sign Up to CareLink</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <form onSubmit={handleSubmit}>
            <VStack gap={4}>
              <Select.Root
                  collection={frameworks}
                  size="sm"
                  width="320px"
                  onValueChange={handleSelectChange}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select role" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    {frameworks.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
              {errors.role && (
                  <Text color="red.500" fontSize="sm">
                    {errors.role}
                  </Text>
              )}

              <VStack align="start" w="full">
                <Input
                    placeholder="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    isInvalid={!!errors.firstName}
                />
                {errors.firstName && (
                    <Text color="red.500" fontSize="sm">
                      {errors.firstName}
                    </Text>
                )}
              </VStack>

              <VStack align="start" w="full">
                <Input
                    placeholder="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    isInvalid={!!errors.lastName}
                />
                {errors.lastName && (
                    <Text color="red.500" fontSize="sm">
                      {errors.lastName}
                    </Text>
                )}
              </VStack>

              <VStack align="start" w="full">
                <Input
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                />
                {errors.email && (
                    <Text color="red.500" fontSize="sm">
                      {errors.email}
                    </Text>
                )}
              </VStack>

              <VStack align="start" w="full">
                <Input
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                />
                {errors.password && (
                    <Text color="red.500" fontSize="sm">
                      {errors.password}
                    </Text>
                )}
              </VStack>
            </VStack>
          </form>
        </DialogBody>

        <DialogFooter>
          {/* Removed DialogActionTrigger to prevent auto-closing on button click */}
          <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Signing up..."
          >
            Sign Up
          </Button>
        </DialogFooter>
      </DialogContent>
  );
};

export default SignUpDialog;
