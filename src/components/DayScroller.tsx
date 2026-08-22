import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTasks, useTasksStore } from '../../store/tasksStore';

const RANGE = 7;

function diffInDays(from: Date, to: Date) {
    const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function formatWeekday(date: Date) {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
}

export function DayScroller({
    day, onDayChanged,
}: DayScrollerProps) {
    const tasks = useTasks();
    const {hasTasks} = useTasksStore();
    const scrollRef = useRef<ScrollView>(null);
    const [viewportWidth, setViewportWidth] = useState(0);

    const anchor = useRef(new Date()).current;

    const days: Date[] = [];
    for (let i = -RANGE; i <= RANGE; i++) {
        const date = new Date(anchor);
        date.setDate(anchor.getDate() + i);
        days.push(date);
    }

    const [showDot, setShowDot] = useState<boolean[]>(() => Array(days.length).fill(false));

    const reloadDots = async () => {
        const results = await Promise.all(days.map((date) => hasTasks(date)));
        setShowDot(results);
    }

    useEffect(() => {
        reloadDots();
    }, [day, tasks]);

    const itemCenters = useRef<number[]>([]);
    const [measuredCount, setMeasuredCount] = useState(0);
    const ready = viewportWidth > 0 && measuredCount === days.length;

    const handleItemLayout = (index: number) => (event: LayoutChangeEvent) => {
        if (itemCenters.current[index] !== undefined) return;
        const { x, width } = event.nativeEvent.layout;
        itemCenters.current[index] = x + width / 2;
        setMeasuredCount((count) => count + 1);
    };

    const currentIndexRef = useRef<number | null>(null);
    const hasCenteredRef = useRef(false);

    useEffect(() => {
        if (!ready) return;

        const targetIndex = Math.min(days.length - 1, Math.max(0, RANGE + diffInDays(anchor, day)));
        if (hasCenteredRef.current && targetIndex === currentIndexRef.current) return;

        const animated = hasCenteredRef.current;
        currentIndexRef.current = targetIndex;
        hasCenteredRef.current = true;
        scrollRef.current?.scrollTo({ x: itemCenters.current[targetIndex], animated });
    }, [day, ready]);

    const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSettle = (x: number) => {
        if (!ready) return;

        const index = itemCenters.current.reduce(
            (closest, center, i) => (Math.abs(center - x) < Math.abs(itemCenters.current[closest] - x) ? i : closest),
            0
        );

        if (index !== currentIndexRef.current) {
            currentIndexRef.current = index;
            onDayChanged?.(days[index]);
        }
        scrollRef.current?.scrollTo({ x: itemCenters.current[index], animated: true });
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        if (settleTimeout.current) clearTimeout(settleTimeout.current);
        settleTimeout.current = setTimeout(() => handleSettle(x), 120);
    };

    const dragState = useRef({ isDragging: false, startX: 0, startScrollLeft: 0 });

    const webDragHandlers = Platform.OS === 'web' ? {
        onMouseDown: (event: any) => {
            dragState.current = { isDragging: true, startX: event.clientX, startScrollLeft: event.currentTarget.scrollLeft };
        },
        onMouseMove: (event: any) => {
            if (!dragState.current.isDragging) return;
            event.currentTarget.scrollLeft = dragState.current.startScrollLeft - (event.clientX - dragState.current.startX);
        },
        onMouseUp: (event: any) => {
            if (!dragState.current.isDragging) return;
            dragState.current.isDragging = false;
            if (settleTimeout.current) clearTimeout(settleTimeout.current);
            handleSettle(event.currentTarget.scrollLeft);
        },
        onMouseLeave: (event: any) => {
            if (!dragState.current.isDragging) return;
            dragState.current.isDragging = false;
            if (settleTimeout.current) clearTimeout(settleTimeout.current);
            handleSettle(event.currentTarget.scrollLeft);
        },
    } : {};

    return (
        <View
            style={styles.dayScrollerContainer}
            onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
        >
            <View style={styles.gradientContainer}>
                <LinearGradient pointerEvents="none" colors={['#DC6E8E', '#DC6E8E00']} start={[0.0, 1.0]} style={styles.fadeOut}/>
                <LinearGradient pointerEvents="none" colors={['#DC6E8E00', '#DC6E8E']} start={[0.0, 1.0]} style={styles.fadeOut}/>
            </View>
            {viewportWidth > 0 && (
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingHorizontal: viewportWidth / 2 }}
                    style={styles.scrollView}
                    {...webDragHandlers}
                >
                    <View style={styles.timelineContainer}>
                        {days.map((date, index) => (
                            <View
                                style={styles.dayWrapper}
                                key={index}
                                onLayout={handleItemLayout(index)}
                            >
                                <View style={styles.spacerContainer}>
                                    {
                                        [...Array(3).keys()].map((i) => (
                                            <View key={i} style={styles.spacer} />
                                        ))
                                    }
                                </View>

                                <View style={styles.dayColumn}>
                                    <Text style={styles.weekdayText}>{formatWeekday(date)}</Text>
                                    <View style={styles.dayContainer}>
                                        <Text style={styles.dayText}>{date.getDate()}</Text>
                                    </View>
                                    {showDot[index] && 
                                        <View style={styles.dotIndicator} />
                                    }
                                </View>

                                <View style={styles.spacerContainer}>
                                    { 
                                        [...Array(3).keys()].map((i) => (
                                           <View key={i} style={[styles.spacer, {transform: [{scaleX: 0.8}]}]} />
                                        ))
                                    }
                                </View>
                            </View>
                        ))}

                    </View>
                </ScrollView>
            )}
            <View style={styles.daySlot}></View>
        </View>
    )
}

interface DayScrollerProps {
    day: Date;
    onDayChanged?: (day: Date) => void;
}

const styles = StyleSheet.create({
    dayScrollerContainer: {
        width: '100%',
        maxWidth: 450,
        height: 82,
        position: 'relative',
        overflow: 'hidden',
    },
    gradientContainer: {
        position: 'absolute',
        width: '100%',
        height: 82,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        pointerEvents: 'none',
    },
    fadeOut: {
        minWidth: 125,
        height: 82,
        zIndex: 5,
    },

    scrollView: {
        width: "100%",
        height: "100%",
    },
    timelineContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 82,
    },
    dayWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 5,
    },
    spacerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    spacer: {
        width: 5,
        height: 12,
        backgroundColor: '#FAF8FC',
        borderRadius: 4,
        opacity: 0.5,
    },
    dayColumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 52,
        userSelect: 'none',
    },
    dayContainer: {
        width: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        fontFamily: "Fredoka-Bold",
        fontSize: 20,
        color: '#FAF8FC',
    },
    weekdayText: {
        fontFamily: "Fredoka-Medium",
        fontSize: 12,
        color: '#FAF8FC',
        opacity: 0.75,
        textTransform: 'capitalize',
    },
    dotIndicator: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#FAF8FC',
        marginTop: 4,
        opacity: 1.0,
    },
    daySlot: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        transform: [{ translateX: -26 }],
        width: 52,
        height: '100%',
        borderRadius: 26,
        backgroundColor: '#FAF8FC',
        pointerEvents: 'none',
        opacity: 0.1,
    },
});
