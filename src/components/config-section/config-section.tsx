import {
  Button,
  Card,
  GridItem,
  Group,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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
import { CustomGate, HGate, PGate, XGate, YGate, ZGate } from "@/lib/gates";
import {
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineRoot,
  TimelineTitle,
} from "@/components/ui/timeline";
import { create, all } from "mathjs";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Complex } from "@/types/bloch";
import { TOLERANCE } from "@/lib/helper-operations";
import { isUnitary } from "@/lib/is-unitary";

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

  const [phiExpression, setPhiExpression] = useState("pi/2");
  const [phiError, setPhiError] = useState(false);
  const [calculatedPhiExpression, setCalculatedPhiExpression] = useState(
    Math.PI / 2,
  );

  const handlePhiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhiExpression(newValue);

    try {
      const value = math.evaluate(newValue);

      if (value === undefined) {
        setPhiError(true);
      } else if (typeof value === "number") {
        setPhiError(false);
        setCalculatedPhiExpression(value);
      } else if (
        value.im !== undefined &&
        value.re !== undefined &&
        typeof value.im === "number" &&
        typeof value.re === "number" &&
        Math.abs(value.im) < TOLERANCE
      ) {
        setPhiError(false);
        setCalculatedPhiExpression(value.re);
      } else {
        setPhiError(true);
      }
    } catch (_err) {
      setPhiError(true);
    }
  };

  const [custom00Expression, setCustom00Expression] = useState("1/sqrt(2)");
  const [custom00Error, setCustom00Error] = useState(false);
  const [calculatedCustom00Expression, setCalculatedCustom00Expression] =
    useState<Complex>({ real: 1 / Math.sqrt(2), imag: 0 });
  const [custom01Expression, setCustom01Expression] = useState("1/sqrt(2)");
  const [custom01Error, setCustom01Error] = useState(false);
  const [calculatedCustom01Expression, setCalculatedCustom01Expression] =
    useState<Complex>({ real: 1 / Math.sqrt(2), imag: 0 });
  const [custom10Expression, setCustom10Expression] = useState("1/sqrt(2)");
  const [custom10Error, setCustom10Error] = useState(false);
  const [calculatedCustom10Expression, setCalculatedCustom10Expression] =
    useState<Complex>({ real: 1 / Math.sqrt(2), imag: 0 });
  const [custom11Expression, setCustom11Expression] = useState("-1/sqrt(2)");
  const [custom11Error, setCustom11Error] = useState(false);
  const [calculatedCustom11Expression, setCalculatedCustom11Expression] =
    useState<Complex>({ real: -1 / Math.sqrt(2), imag: 0 });

  const [customGateError, setCustomGateError] = useState<string | null>(null);

  useEffect(() => {
    if (custom00Error || custom01Error || custom10Error || custom11Error) {
      setCustomGateError("Invalid expression(s)");
      return;
    }

    if (
      isUnitary({
        _00: calculatedCustom00Expression,
        _01: calculatedCustom01Expression,
        _10: calculatedCustom10Expression,
        _11: calculatedCustom11Expression,
      })
    ) {
      setCustomGateError(null);
      return;
    }

    setCustomGateError(
      "The given matrix is not a valid quantum gate because it's not unitary",
    );
  }, [
    calculatedCustom00Expression,
    calculatedCustom01Expression,
    calculatedCustom10Expression,
    calculatedCustom11Expression,
    custom00Error,
    custom01Error,
    custom10Error,
    custom11Error,
  ]);

  const handleCustomChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setExpression: (expression: string) => void,
    setCalculatedExpression: (calculatedExpression: Complex) => void,
    setError: (error: boolean) => void,
  ) => {
    const newValue = e.target.value;
    setExpression(newValue);

    try {
      const value = math.evaluate(newValue);

      if (value === undefined) {
        setError(true);
      } else if (typeof value === "number") {
        setError(false);
        setCalculatedExpression({ real: value, imag: 0 });
      } else if (
        value.im !== undefined &&
        value.re !== undefined &&
        typeof value.im === "number" &&
        typeof value.re === "number"
      ) {
        setError(false);
        setCalculatedExpression({ real: value.re, imag: value.im });
      } else {
        setError(true);
      }
    } catch (_err) {
      setError(true);
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
                applyGate(PGate(calculatedPhiExpression, phiExpression))
              }
              disabled={phiError}
            >
              <strong>P</strong>(ϕ =
            </Button>
            <Input
              size={"sm"}
              placeholder="e^(pi*i)/sqrt(2)"
              value={phiExpression}
              onChange={handlePhiChange}
              borderRadius={0}
              borderColor={phiError ? "border.error" : "gray.subtle"}
              width={"150px"}
              marginRight={0}
              _focus={{ outline: 0 }}
              _active={{ outline: 0 }}
            />
            <Button
              size={"sm"}
              variant={"subtle"}
              onClick={() =>
                applyGate(PGate(calculatedPhiExpression, phiExpression))
              }
              disabled={phiError}
            >
              )
            </Button>
          </Group>
          <PopoverRoot>
            <PopoverTrigger asChild>
              <Button size={"sm"} variant={"subtle"}>
                <strong>Custom...</strong>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <SimpleGrid columns={6} gap={4}>
                  <GridItem colSpan={1} rowSpan={2}>
                    <Text fontSize={"75px"} lineHeight={"75px"}>
                      [
                    </Text>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Input
                      size={"sm"}
                      placeholder="1/sqrt(2)"
                      value={custom00Expression}
                      onChange={(e) =>
                        handleCustomChange(
                          e,
                          setCustom00Expression,
                          setCalculatedCustom00Expression,
                          setCustom00Error,
                        )
                      }
                      borderRadius={0}
                      borderColor={
                        custom00Error ? "border.error" : "gray.solid"
                      }
                      marginRight={0}
                      _focus={{ outline: 0 }}
                      _active={{ outline: 0 }}
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Input
                      size={"sm"}
                      placeholder="1/sqrt(2)"
                      value={custom01Expression}
                      onChange={(e) =>
                        handleCustomChange(
                          e,
                          setCustom01Expression,
                          setCalculatedCustom01Expression,
                          setCustom01Error,
                        )
                      }
                      borderRadius={0}
                      borderColor={
                        custom01Error ? "border.error" : "gray.solid"
                      }
                      marginRight={0}
                      _focus={{ outline: 0 }}
                      _active={{ outline: 0 }}
                    />
                  </GridItem>
                  <GridItem colSpan={1} rowSpan={2}>
                    <Text fontSize={"75px"} lineHeight={"75px"}>
                      ]
                    </Text>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Input
                      size={"sm"}
                      placeholder="1/sqrt(2)"
                      value={custom10Expression}
                      onChange={(e) =>
                        handleCustomChange(
                          e,
                          setCustom10Expression,
                          setCalculatedCustom10Expression,
                          setCustom10Error,
                        )
                      }
                      borderRadius={0}
                      borderColor={
                        custom10Error ? "border.error" : "gray.solid"
                      }
                      marginRight={0}
                      _focus={{ outline: 0 }}
                      _active={{ outline: 0 }}
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Input
                      size={"sm"}
                      placeholder="-1/sqrt(2)"
                      value={custom11Expression}
                      onChange={(e) =>
                        handleCustomChange(
                          e,
                          setCustom11Expression,
                          setCalculatedCustom11Expression,
                          setCustom11Error,
                        )
                      }
                      borderRadius={0}
                      borderColor={
                        custom11Error ? "border.error" : "gray.solid"
                      }
                      marginRight={0}
                      _focus={{ outline: 0 }}
                      _active={{ outline: 0 }}
                    />
                  </GridItem>
                  <GridItem colSpan={6}>
                    <VStack w={"full"} alignItems={"stretch"} gap={2}>
                      {customGateError !== null && (
                        <Text colorPalette={"red"} textAlign={"center"}>
                          {customGateError}
                        </Text>
                      )}
                      <Button
                        size={"sm"}
                        variant={"subtle"}
                        onClick={() =>
                          applyGate(
                            CustomGate(
                              {
                                _00: calculatedCustom00Expression,
                                _01: calculatedCustom01Expression,
                                _10: calculatedCustom10Expression,
                                _11: calculatedCustom11Expression,
                              },
                              {
                                _00: custom00Expression,
                                _01: custom01Expression,
                                _10: custom10Expression,
                                _11: custom11Expression,
                              },
                            ),
                          )
                        }
                        disabled={customGateError !== null}
                      >
                        <strong>Apply gate</strong>
                      </Button>
                    </VStack>
                  </GridItem>
                </SimpleGrid>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
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
                            : `${item.gateUsed.name} gate used${item.gateUsed.name === "P" ? ` with parameter ϕ = ${item.gateUsed.originalExpression ?? item.gateUsed.phi}` : ""}`}
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
