import { Dimensions } from "react-native";

export const { width: screenWidthModal, height: screenHeightModal } = Dimensions.get("window");

export const TASK_COLORS = [
    "#66c5cc",
    "#f6cf71",
    "#f89c74",
    "#dcb0f2",
    "#87c55f",
    "#9eb9f3",
    "#fe88b1",
    "#b3b3b3",
] as const;

export const TASK_STATUS = [
    "todo",
    "done"
] as const;

export const TASK_FREQUENCY = [
    "daily",
    "weekly",
    "monthly"
] as const;