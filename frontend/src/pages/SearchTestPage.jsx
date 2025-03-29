import { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { NannySearchPopup } from "../components/NannySearchPopup";

const SearchTestPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  console.log("Popup open:", isOpen); // 🔍 Check if state updates

  return (
    <Box p={10}>
      <Button
        colorScheme="blue"
        onClick={() => {
          console.log("Button clicked!"); // 🔍 Click is working
          setIsOpen(true);
        }}
      >
        Simulate Search
      </Button>

      {/* Debug test: this should show if isOpen works */}
      {isOpen && <Box bg="red.200" p={4}>Popup flag is TRUE</Box>}

      <NannySearchPopup isOpen={isOpen} onClose={() => {
        console.log("Popup closed");
        setIsOpen(false);
      }} />
    </Box>
  );
};

export default SearchTestPage;
