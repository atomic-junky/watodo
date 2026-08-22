import { Dimensions } from "react-native";

export const { width: screenWidthModal, height: screenHeightModal } = Dimensions.get("window");

export const TASK_COLORS = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#A133FF",
    "#33FFF6"
] as const;

export const TASK_STATUS = [
    "todo",
    "done"
] as const;