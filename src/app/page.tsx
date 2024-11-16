"use client";
import { BlochSphere } from "@/components/bloch-sphere/bloch-sphere";
import { ConfigSection } from "@/components/config-section/config-section";
import { ColorModeButton } from "@/components/ui/color-mode";
import { stateToString } from "@/lib/state-parser";
import { useAppContext } from "@/state/app-context";
import { Box, Stack, Text, VStack } from "@chakra-ui/react";

import { Noto_Sans_Math } from "next/font/google";

const notoSansMath = Noto_Sans_Math({
  subsets: ["math"],
  display: "swap",
  weight: "400",
});

export default function Home() {
  const {
    history,
    currentHistoryIndex,
    settings: { showAxesHelper, showStats },
    controlsRef,
  } = useAppContext();

  return (
    <Box
      display={"flex"}
      minWidth={"100vw"}
      minHeight={"100vh"}
      maxWidth={"100vw"}
      maxHeight={"100vh"}
      overflow={"hidden"}
      className={notoSansMath.className}
    >
      <Box position={"absolute"} top={"6px"} right={"6px"} zIndex={100}>
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
            <BlochSphere
              arrowDirection={
                history[
                  currentHistoryIndex > history.length - 1
                    ? 0
                    : currentHistoryIndex
                ].currentState
              }
              tracking={
                currentHistoryIndex === 0
                  ? undefined
                  : {
                      previousDirection:
                        history[currentHistoryIndex - 1].currentState,
                      gateUsed: history[currentHistoryIndex].gateUsed,
                    }
              }
              showAxesHelper={showAxesHelper}
              showStats={showStats}
              controlsRef={controlsRef}
            />
            <Box
              position={"absolute"}
              bottom={0}
              left={0}
              zIndex={100}
              backgroundColor={"gray.contrast"}
              padding={2}
              userSelect={"text"}
              cursor={"text"}
            >
              <Text>{`Current state: ${stateToString(
                history[
                  currentHistoryIndex > history.length - 1
                    ? 0
                    : currentHistoryIndex
                ].currentState,
              )}`}</Text>
            </Box>
          </Box>
        </Box>
        <VStack flex={1} gap={16} paddingY={16} overflowY={"scroll"}>
          <ConfigSection />
        </VStack>
      </Stack>
    </Box>
  );
}
