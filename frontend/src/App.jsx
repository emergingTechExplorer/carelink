import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NannyDetail from "./pages/NannyDetail";
import NannyFindPage from "./pages/NannyFindPage";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPage.jsx";
import {  useColorModeValue } from "./components/ui/color-mode";
import BabysitterEditPage from "@/pages/NannyEdit.jsx";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/nanny/:id" element={<NannyDetail />} />
          <Route path="/nanny-find" element={<NannyFindPage />} />
          <Route path="/nanny-edit" element={<BabysitterEditPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
