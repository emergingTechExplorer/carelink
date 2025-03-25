import {
  Button,
  Container,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ColorModeButton } from "./ui/color-mode";
import {
  DialogRoot,
  DialogTrigger,
} from "./ui/dialog";
import LoginDialog from "./LoginDialog";
import SignUpDialog from "./SignUpDialog";

const Navbar = () => {
  return (
    <Container maxW={"1140px"} px={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
      >
        <Text
          fontSize={{ base: "22px", sm: "28px" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient="to-r"
          gradientFrom="cyan.400"
          gradientTo="blue.500"
          bgClip={"text"}
        >
          <Link to={"/"}>CareLink</Link>
        </Text>

        <HStack spacing={2} alignItems="center">
          {/* Login Button and Dialog */}
          <DialogRoot>
            <DialogTrigger asChild>
              <Button>Login</Button>
            </DialogTrigger>
            <LoginDialog />
          </DialogRoot>

          {/* Sign Up Button and Dialog */}
          <DialogRoot>
            <DialogTrigger asChild>
              <Button>Sign Up</Button>
            </DialogTrigger>
            <SignUpDialog />
          </DialogRoot>

          <ColorModeButton />
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;