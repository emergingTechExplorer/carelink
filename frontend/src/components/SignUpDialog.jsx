// src/components/SignUpDialog.jsx

"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogCloseTrigger,
} from "./ui/dialog";
import {
  Button,
  Input,
  VStack,
  Select,
  createListCollection,
  Portal,
} from "@chakra-ui/react";

const SignUpDialog = () => {
  return (
    <DialogContent>
      <DialogCloseTrigger />
      <DialogHeader>
        <DialogTitle>Sign UP TO CARELINK</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <VStack gap={4}>
          <Select.Root collection={frameworks} size="sm" width="320px">
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
                {frameworks.items.map((framework) => (
                  <Select.Item item={framework} key={framework.value}>
                    {framework.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          <Input placeholder="First Name" name="firstName" />
          <Input placeholder="Last Name" name="lastName" />
          <Input placeholder="Email" name="email" type="email" />
          <Input placeholder="Password" name="password" type="password" />
        </VStack>
      </DialogBody>
      <DialogFooter>
        <DialogActionTrigger asChild>
          <Button colorScheme="blue">Sign Up</Button>
        </DialogActionTrigger>
      </DialogFooter>
    </DialogContent>
  );
};

const frameworks = createListCollection({
  items: [
    { label: "As Parent", value: "parent" },
    { label: "As Babysitter", value: "babysitter" },
  ],
});

export default SignUpDialog;
