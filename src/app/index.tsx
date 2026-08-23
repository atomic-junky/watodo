import CardNotes from "@/components/CardNotes";
import CardTasks from "@/components/CardTasks";
import { DayScroller } from "@/components/DayScroller";
import HabitRow from "@/components/HabitRow";
import { NavBar } from "@/components/NavBar";
import { WatodoIcon } from "@/components/WatodoIcon";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits, useHabitsStore } from "../../store/habitStore";
import { useNotes, useNotesStore } from "../../store/notesStore";
import { useTasks, useTasksStore } from "../../store/tasksStore";
import { Habit } from "../../types/habitTypes";
import { Task } from "../../types/taskTypes";
import ModalHabits from "../components/ModalHabits";
import ModalNotes from "../components/ModalNotes";
import ModalTasks from "../components/ModalTasks";


export default function Index() {
  const today = new Date();
  const [day, setDay] = useState<Date>(new Date());

  const tasks = useTasks();
  const getTasks = useTasksStore((state) => state.getTasks);
  const notes = useNotes();
  const getNotes = useNotesStore((state) => state.getNotes);
  const habits = useHabits();
  const getHabits = useHabitsStore((state) => state.getHabits);

  useEffect(() => {
    getTasks(day);
    getNotes(day);
    getHabits();
  }, [day]);

  const [selectedTasks, setSelectedTasks] = useState<Task[] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [habitsModalVisible, setHabitsModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const handleOpenTasks = (tasks: Task[]) => {
    setSelectedTasks(tasks);
    setModalVisible(true);
  }

  const handleCreateTask = () => {
    setSelectedTasks(null);
    setModalVisible(true);
  }

  const handleEditTask = (task: Task) => {
    setSelectedTasks([task]);
    setModalVisible(true);
  }

  const handleCloseModal = () => {
    setSelectedTasks(null);
    setModalVisible(false);
  }

  const handleOpenSettings = () => { }

  const handleOpenNotes = () => {
    setNotesModalVisible(true);
  }

  const handleCloseNotesModal = () => {
    setNotesModalVisible(false);
  }

  const handleCreateHabit = () => {
    setSelectedHabit(null);
    setHabitsModalVisible(true);
  }

  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setHabitsModalVisible(true);
  }

  const handleCloseHabitsModal = () => {
    setSelectedHabit(null);
    setHabitsModalVisible(false);
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('fr-FR', options);
  }

  const getHabitCategories = () => {
    const categories = habits.map(habit => habit.category);
    return Array.from(new Set(categories));
  }

  return (
    <View style={styles.app}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Salut, Constance 👋</Text>
              <Text style={styles.subtitle}>{formatDate(today)}</Text>
            </View>
            <TouchableOpacity onPress={handleOpenSettings}>
              <WatodoIcon name="settings" size={35} color={"#FAF8FC"}/>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainArea}>
          <DayScroller day={day} onDayChanged={setDay} />

          <View style={styles.body}>
            <View style={styles.content}>
              <View style={styles.contentHeader}>
                <View style={styles.dualSectionContainer}>
                  <Text style={styles.sectionTitle}>Tâches</Text>
                  <CardTasks date={day} onPressed={() => handleOpenTasks(tasks)}/>
                </View>
                <View style={styles.dualSectionContainer}>
                  <Text style={styles.sectionTitle}>Notes</Text>
                  <CardNotes date={day} onPressed={handleOpenNotes}/>
                </View>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Habitudes</Text>
                {
                  getHabitCategories().map((category, index) => (
                    <View key={index} style={styles.categoryContainer}>
                      <Text style={styles.categoryTitle}>{category}</Text>
                      <View style={styles.categoryRowContainer}>
                        {
                          habits.filter(habit => habit.category === category).map((habit, index) => (
                            <HabitRow key={index} date={day} habit={habit} onPressed={() => {}} onLongPress={() => handleEditHabit(habit)} />
                          ))
                        }
                      </View>
                    </View>
                  ))
                }
              </View>
            </View>
          </View>

          <View style={styles.navigation}>
            <NavBar onPressAdd={handleCreateHabit} />
          </View>

        </View>
      </SafeAreaView>
      <ModalTasks
        visible={modalVisible}
        tasks={selectedTasks || undefined}
        day={day}
        onClose={handleCloseModal}
        onSuccess={() => {}}
        onCreate={handleCreateTask}
        onEdit={handleEditTask}
      />

      <ModalNotes
        visible={notesModalVisible}
        notes={notes || undefined}
        day={day}
        onClose={handleCloseNotesModal}
        onSuccess={() => getNotes(day)}
      />

      <ModalHabits
        visible={habitsModalVisible}
        habit={selectedHabit || undefined}
        onClose={handleCloseHabitsModal}
        onSuccess={() => getHabits()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    width: "100%",
    height: "100%",
    backgroundColor: "#DC6E8E",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 10,
    height: "100%",
  },

  header: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    height: 100,
  },
  headerTop: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 25,
    gap: 10,
  },
  titleContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: "Fredoka-Bold",
    color: "#FAF8FC",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.75,
    fontFamily: "Fredoka-SemiBold",
    color: "#FAF8FC",
  },

  mainArea: {
    width: "100%",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 10,
    position: "relative",
  },

  body: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    backgroundColor: "#FAF8FC",
    borderRadius: "50px",
  },

  content: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 10,
    padding: 25,
    maxWidth: 600,
  },

  navigation: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  contentHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 20,
  },
  dualSectionContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 10,
  },
  sectionContainer: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Fredoka-Bold",
    width: "100%",
    color: "#3A0203",
  },
  categoryContainer: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 5,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: "Fredoka-Medium",
    color: "#3A0203",
  },
  categoryRowContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 10,
    paddingLeft: 20,
  }
});
