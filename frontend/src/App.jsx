import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NannyDetail from "./pages/NannyDetail";
import CreatePage from "./pages/CreatePage";
import NannyFindPage from "./pages/NannyFindPage";
import Navbar from "./components/Navbar";
import SearchTestPage from "./pages/SearchTestPage";
import {  useColorModeValue } from "./components/ui/color-mode";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <Toaster />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/nanny/:id" element={<NannyDetail />} />
          <Route path="/test-search" element={<SearchTestPage />} />
          <Route path="/nanny-find" element={<NannyFindPage />} />

        </Routes>
      </Box>
    </>
  );
}

export default App;
