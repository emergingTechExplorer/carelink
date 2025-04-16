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
import { Button, Input, VStack, Text } from "@chakra-ui/react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";

const LoginDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { setUser } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.signin(formData);
      setUser(response);
      alert("Login successful! Welcome back!");
      // Close dialog on successful login
      document.querySelector('[data-dialog-close]')?.click();
      window.location.reload(); // Reload only on success
    } catch (error) {
      alert(error.message || "Invalid email or password");
      // The dialog will remain open for user correction.
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>LOGIN TO CARELINK</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit}>
            <VStack gap={4}>
              <VStack align="start" w="full">
                <Text fontWeight="medium">Email</Text>
                <Input
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                />
                {errors.email && (
                    <Text color="red.500" fontSize="sm">{errors.email}</Text>
                )}
              </VStack>

              <VStack align="start" w="full">
                <Text fontWeight="medium">Password</Text>
                <Input
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                />
                {errors.password && (
                    <Text color="red.500" fontSize="sm">{errors.password}</Text>
                )}
              </VStack>
            </VStack>
          </form>
        </DialogBody>
        <DialogFooter>
          {/* Removed DialogActionTrigger so the dialog won't auto-close */}
          <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Logging in..."
          >
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
  );
};

export default LoginDialog;
