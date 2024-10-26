"use client";
import { BlochSphere } from "@/components/bloch-sphere/bloch-sphere";
import { ColorModeButton } from "@/components/ui/color-mode";
import { Box, Center, Stack, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box
      display={"flex"}
      minWidth={"100vw"}
      minHeight={"100vh"}
      maxWidth={"100vw"}
      maxHeight={"100vh"}
      overflow={"hidden"}
    >
      <Box position={"absolute"} top={4} right={4} zIndex={100}>
        <ColorModeButton />
      </Box>
      <Stack
        direction={{ base: "column", md: "row" }}
        flex={1}
        alignItems={"stretch"}
      >
        <Box
          flex={1}
          position={"relative"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          userSelect={"none"}
        >
          <Box
            position={"relative"}
            w={"100%"}
            aspectRatio={"square"}
            cursor={"pointer"}
          >
            <BlochSphere />
          </Box>
        </Box>
        <Center flex={1}>
          <Text>[config]</Text>
        </Center>
      </Stack>
    </Box>
  );
}
