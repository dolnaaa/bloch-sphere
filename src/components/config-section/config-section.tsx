import { Button, Card, Group, Input, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { CollapsibleCard } from "@/components/collapsible-card/collapsible-card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/state/app-context";
import {
  LuCircle,
  LuCircleDashed,
  LuCircleDot,
  LuMove3D,
  LuRedo,
  LuUndo,
  LuUndo2,
} from "react-icons/lu";
import { HGate, PGate, XGate, YGate, ZGate } from "@/lib/gates";
import {
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineRoot,
  TimelineTitle,
} from "@/components/ui/timeline";
import { create, all } from "mathjs";
import { useColorModeValue } from "@/components/ui/color-mode";

const math = create(all);

export const ConfigSection: React.FC = () => {
  const {
    settings: { showAxesHelper, setShowAxesHelper, showStats, setShowStats },
    undo,
    redo,
    resetHistory,
    applyGate,
    canUndo,
    canRedo,
    history,
    currentHistoryIndex,
    resetRotation,
  } = useAppContext();

  const [thetaExpression, setThetaExpression] = useState("pi/2");
  const [thetaError, setThetaError] = useState(false);
  const [calculatedThetaExpression, setCalculatedThetaExpression] = useState(
    Math.PI / 2,
  );
  const inputBorderColor = useColorModeValue("gray.100", "gray.900");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setThetaExpression(newValue);

    const TOLERANCE = 1e-12;

    try {
      const value = math.evaluate(newValue);

      if (value === undefined) {
        setThetaError(true);
      } else if (typeof value === "number") {
        setThetaError(false);
        setCalculatedThetaExpression(value);
      } else if (
        value.im !== undefined &&
        value.re !== undefined &&
        typeof value.im === "number" &&
        typeof value.re === "number" &&
        Math.abs(value.im) < TOLERANCE
      ) {
        setThetaError(false);
        setCalculatedThetaExpression(value.re);
      } else {
        setThetaError(true);
      }
    } catch (_err) {
      setThetaError(true);
    }
  };

  return (
    <VStack
      alignSelf={"stretch"}
      alignItems={"stretch"}
      gap={4}
      paddingLeft={{ base: 2, md: 0 }}
      paddingRight={{ base: 2, md: 12 }}
    >
      <CollapsibleCard title="Gates">
        <Group wrap={"wrap"}>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(XGate)}
          >
            <strong>X</strong>
          </Button>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(YGate)}
          >
            <strong>Y</strong>
          </Button>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(ZGate)}
          >
            <strong>Z</strong>
          </Button>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(HGate)}
          >
            <strong>H</strong>
          </Button>
          <Group attached>
            <Button
              size={"sm"}
              variant={"subtle"}
              onClick={() =>
                applyGate(PGate(calculatedThetaExpression, thetaExpression))
              }
              disabled={thetaError}
            >
              <strong>P</strong>(θ =
            </Button>
            <Input
              size={"sm"}
              placeholder="e.g., e^(i*pi/sqrt(2))"
              value={thetaExpression}
              onChange={handleChange}
              borderRadius={0}
              borderColor={thetaError ? "border.error" : inputBorderColor}
              width={"150px"}
              marginRight={0}
              _focus={{ outline: 0 }}
              _active={{ outline: 0 }}
            />
            <Button
              size={"sm"}
              variant={"subtle"}
              onClick={() =>
                applyGate(PGate(calculatedThetaExpression, thetaExpression))
              }
              disabled={thetaError}
            >
              )
            </Button>
          </Group>
        </Group>
      </CollapsibleCard>
      <CollapsibleCard title="History">
        <VStack gap={4} alignSelf={"stretch"} alignItems={"stretch"}>
          <Group wrap={"wrap"}>
            <Button
              size={"sm"}
              variant={"subtle"}
              onClick={undo}
              disabled={!canUndo()}
            >
              <LuUndo /> Undo
            </Button>
            <Button
              size={"sm"}
              variant={"subtle"}
              onClick={redo}
              disabled={!canRedo()}
            >
              <LuRedo /> Redo
            </Button>
            <Button
              size={"sm"}
              variant={"subtle"}
              colorPalette={"red"}
              onClick={() => resetHistory()}
            >
              <LuUndo2 /> Reset state to ∣0⟩
            </Button>
          </Group>
          <Card.Root w={"full"} maxH={"300px"} overflowY={"scroll"}>
            <Card.Body paddingBottom={0}>
              <TimelineRoot variant={"subtle"} w="full">
                {history.toReversed().map((item, index) => {
                  const reversedCurrentHistoryIndex =
                    history.length - 1 - currentHistoryIndex;
                  return (
                    <TimelineItem key={index}>
                      <TimelineConnector
                        {...(index === reversedCurrentHistoryIndex
                          ? { bg: "#317572", color: "teal.contrast" }
                          : index > reversedCurrentHistoryIndex
                            ? { bg: "gray.solid", color: "gray.contrast" }
                            : {})}
                      >
                        {index === reversedCurrentHistoryIndex ? (
                          <LuCircleDot />
                        ) : index > reversedCurrentHistoryIndex ? (
                          <LuCircle />
                        ) : (
                          <LuCircleDashed />
                        )}
                      </TimelineConnector>
                      <TimelineContent>
                        <TimelineTitle>
                          {item.gateUsed.name === "init"
                            ? "Initialized with ∣0⟩"
                            : `${item.gateUsed.name} gate used${item.gateUsed.name === "P" ? ` with parameter θ = ${item.gateUsed.originalExpression ?? item.gateUsed.theta}` : ""}`}
                        </TimelineTitle>
                        {/* <TimelineDescription>13th May 2021</TimelineDescription> */}
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </TimelineRoot>
            </Card.Body>
          </Card.Root>
        </VStack>
      </CollapsibleCard>
      <CollapsibleCard title="Settings">
        <VStack gap={4} alignSelf={"stretch"} alignItems={"stretch"}>
          <Button
            size={"sm"}
            variant={"subtle"}
            colorPalette={"red"}
            onClick={resetRotation}
            alignSelf={"flex-start"}
          >
            <LuMove3D /> Reset rotation, zoom
          </Button>
          <Checkbox
            variant={"subtle"}
            checked={showAxesHelper}
            onCheckedChange={(e) => setShowAxesHelper(!!e.checked)}
          >
            Show axes helper (X: red. Y: green. Z: blue)
          </Checkbox>
          <Checkbox
            variant={"subtle"}
            checked={showStats}
            onCheckedChange={(e) => setShowStats(!!e.checked)}
          >
            Show stats
          </Checkbox>
        </VStack>
      </CollapsibleCard>
    </VStack>
  );
};
