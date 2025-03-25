// src/components/LoginDialog.jsx

import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogActionTrigger,
    DialogCloseTrigger,
  } from "./ui/dialog";
  import { Button, Input, VStack } from "@chakra-ui/react";
  
  const LoginDialog = () => {
    return (
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>LOGIN TO CARELINK</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack gap={4}>
            <Input placeholder="Email" name="email" type="email" />
            <Input placeholder="Password" name="password" type="password" />
          </VStack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button>Login</Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    );
  };
  
  export default LoginDialog;