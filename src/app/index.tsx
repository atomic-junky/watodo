import CardNotes from "@/components/CardNotes";
import CardTasks from "@/components/CardTasks";
import { DayScroller } from "@/components/DayScroller";
import { NavBar } from "@/components/NavBar";
import { WatodoIcon } from "@/components/WatodoIcon";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTasks, useTasksStore } from "../../store/tasksStore";
import { Task } from "../../types/taskTypes";
import ModalTasks from "../components/ModalTasks";


export default function Index() {
  const today = new Date();
  const [day, setDay] = useState<Date>(new Date());
  const tasks = useTasks();
  const getTasks = useTasksStore((state) => state.getTasks);

  useEffect(() => {
    getTasks(day);
  }, [day]);

  const [selectedTasks, setSelectedTasks] = useState<Task[] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleOpenNotes = () => { }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('fr-FR', options);
  }

  return (
    <View style={styles.app}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Salut, Constance 👋</Text>
            <Text style={styles.subtitle}>{formatDate(today)}</Text>
          </View>
          <TouchableOpacity onPress={handleOpenSettings}>
            <WatodoIcon name="settings" size={35} color={"#FAF8FC"}/>
          </TouchableOpacity>
        </View>

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
                <CardNotes/>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Habitudes</Text>

            </View>
        
            <ModalTasks
              visible={modalVisible}
              tasks={selectedTasks || undefined}
              onClose={handleCloseModal}
              onSuccess={() => {}}
              onCreate={handleCreateTask}
              onEdit={handleEditTask}
            />
          </View>

        </View>

        <View style={styles.navigation}>
          <NavBar onPressAdd={handleCreateTask} />
        </View>
      </SafeAreaView>
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

  body: {
    width: "100%",
    height: "100%",
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
    backgroundColor: "#FAF8FC",
    borderRadius: "50px",
    color: "#3A0203",
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
});
