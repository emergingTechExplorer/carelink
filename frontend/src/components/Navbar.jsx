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
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
      <Container maxW="1140px" px={4}>
        <Flex
            h={16}
            alignItems="center"
            justifyContent="space-between"
            flexDir={{ base: "column", sm: "row" }}
        >
          <Text
              fontSize={{ base: "22px", sm: "28px" }}
              fontWeight="bold"
              textTransform="uppercase"
              textAlign="center"
              bgGradient="to-r"
              gradientFrom="cyan.400"
              gradientTo="blue.500"
              bgClip="text"
          >
            <Link to="/">CareLink</Link>
          </Text>

          <HStack spacing={2} alignItems="center">
            {!user && (
                <>
                  <DialogRoot>
                    <DialogTrigger asChild>
                      <Button>Login</Button>
                    </DialogTrigger>
                    <LoginDialog />
                  </DialogRoot>

                  <DialogRoot>
                    <DialogTrigger asChild>
                      <Button>Sign Up</Button>
                    </DialogTrigger>
                    <SignUpDialog />
                  </DialogRoot>
                </>
            )}

            {user && (
                <>
                  <Text>Hello, {user.firstName}</Text>
                  <Button onClick={handleLogout}>Logout</Button>
                </>
            )}

            <ColorModeButton />
          </HStack>
        </Flex>
      </Container>
  );
};

export default Navbar;
