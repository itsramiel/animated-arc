import { Canvas, Paint, Path, Skia, SkiaValue, SweepGradient, useComputedValue, vec, runTiming, useValue } from "@shopify/react-native-skia";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { Button, Dimensions, Easing, SafeAreaView, StyleSheet, Text, View } from "react-native";

const MARGIN = 24;
const STROKE_WIDTH = 16;
const SCREEN_WIDTH = Dimensions.get("window").width;
const VIEW_WIDTH = SCREEN_WIDTH - 2 * MARGIN;
const DRAW_WIDTH = VIEW_WIDTH - 2 * STROKE_WIDTH;

const purple = "#9c27b0";
const blue = "#29b6f6";
const lightGrey = "#eeeeee";
const textPurple = "#311b92";
const textGrey = "#616161";

const getRandomPercentage = () => Number(Math.random().toFixed(2));

export default function App() {
  const [progress, setProgress] = useState(() => getRandomPercentage());
  const onPress = useCallback(() => {
    setProgress(getRandomPercentage());
  }, []);

  const skValue = useValue(0);

  useEffect(() => {
    runTiming(skValue, { to: progress }, { duration: 500, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ margin: MARGIN, height: VIEW_WIDTH / 2 + STROKE_WIDTH, width: VIEW_WIDTH }}>
        <Canvas style={{ width: VIEW_WIDTH, height: VIEW_WIDTH / 2 + STROKE_WIDTH }}>
          <Dial progress={skValue} />
        </Canvas>
      </View>
      <View>
        <Text style={{ textAlign: "center", fontSize: 30 }}>{(progress * 100).toFixed(0)}</Text>
      </View>
      <Button title="Change" onPress={onPress} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

interface DialProps {
  progress: SkiaValue<number>;
}

const Dial = ({ progress }: DialProps) => {
  const path = Skia.Path.Make();
  path.moveTo(0, VIEW_WIDTH / 2);
  path.addArc({ x: STROKE_WIDTH, y: STROKE_WIDTH, width: DRAW_WIDTH, height: DRAW_WIDTH }, 180, 180);

  const end = useComputedValue(() => {
    return 180 + 180 * progress.current;
  }, [progress]);

  return (
    <>
      <Path path={path} color="transparent">
        <Paint style={"stroke"} strokeWidth={STROKE_WIDTH} strokeCap="round" color={lightGrey} />
      </Path>
      <Path path={path} color="transparent" end={progress}>
        <Paint style={"stroke"} strokeWidth={STROKE_WIDTH} strokeCap="round">
          <SweepGradient c={vec(VIEW_WIDTH / 2, VIEW_WIDTH / 2 + STROKE_WIDTH)} colors={[purple, blue]} start={180} end={end} />
        </Paint>
      </Path>
    </>
  );
};
