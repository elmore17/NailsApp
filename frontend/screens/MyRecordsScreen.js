import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";

// Моковые данные записей
const mockRecords = [
  {
    id: "1",
    date: "2024-12-15",
    time: "10:00",
    service: "Стрижка мужская",
    price: 1200,
    master: "Иван Петров",
  },
  {
    id: "2",
    date: "2024-12-16",
    time: "14:00",
    service: "Окрашивание волос",
    price: 2500,
    master: "Мария Сидорова",
  },
  {
    id: "3",
    date: "2024-12-17",
    time: "11:00",
    service: "Маникюр",
    price: 800,
    master: "Анна Козлова",
  },
];

export default function MyRecordsScreen({ navigation }) {
  const [records, setRecords] = useState(mockRecords);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleCancel = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const confirmCancel = () => {
    if (!cancelReason.trim()) {
      Alert.alert("Ошибка", "Пожалуйста, укажите причину отмены");
      return;
    }

    // Удаляем запись из списка
    setRecords(records.filter((r) => r.id !== selectedRecord.id));
    
    // Здесь можно добавить логику отправки на сервер
    console.log("Отмена записи:", {
      record: selectedRecord,
      reason: cancelReason,
    });

    setModalVisible(false);
    setCancelReason("");
    setSelectedRecord(null);
    Alert.alert("Успех", "Запись отменена");
  };

  const handleReschedule = (record) => {
    setSelectedRecord(record);
    setRescheduleModalVisible(true);
  };

  const confirmReschedule = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Ошибка", "Пожалуйста, выберите дату и время");
      return;
    }

    // Обновляем запись
    const updatedRecords = records.map((record) =>
      record.id === selectedRecord.id
        ? {
            ...record,
            date: selectedDate,
            time: selectedTime,
          }
        : record
    );

    setRecords(updatedRecords);
    setRescheduleModalVisible(false);
    setSelectedRecord(null);
    setSelectedDate(null);
    setSelectedTime(null);
    Alert.alert("Успех", "Запись перенесена");
  };

  const availableTimes = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>

      {records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>У вас нет активных записей</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {records.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordDate}>
                  {formatDate(record.date)} в {record.time}
                </Text>
                <Text style={styles.recordPrice}>{record.price} ₽</Text>
              </View>
              
              <Text style={styles.serviceName}>{record.service}</Text>
              <Text style={styles.masterName}>Мастер: {record.master}</Text>
              
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.rescheduleButton]}
                  onPress={() => handleReschedule(record)}
                >
                  <Text style={styles.rescheduleButtonText}>Перенести</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => handleCancel(record)}
                >
                  <Text style={styles.cancelButtonText}>Отменить</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Модальное окно отмены записи */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Отмена записи</Text>
            <Text style={styles.modalText}>
              Вы уверены, что хотите отменить запись на{" "}
              {selectedRecord && formatDate(selectedRecord.date)} в{" "}
              {selectedRecord?.time}?
            </Text>
            
            <Text style={styles.reasonLabel}>Укажите причину отмены:</Text>
            <TextInput
              style={styles.reasonInput}
              multiline
              numberOfLines={3}
              placeholder="Причина отмены..."
              value={cancelReason}
              onChangeText={setCancelReason}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setModalVisible(false);
                  setCancelReason("");
                }}
              >
                <Text style={styles.cancelModalButtonText}>Назад</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmCancel}
              >
                <Text style={styles.confirmButtonText}>Подтвердить отмену</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно переноса записи */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={rescheduleModalVisible}
        onRequestClose={() => setRescheduleModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Перенос записи</Text>
            <Text style={styles.modalText}>
              Перенести "{selectedRecord?.service}" на другую дату
            </Text>

            {/* Простой выбор даты */}
            <Text style={styles.dateLabel}>Выберите дату:</Text>
            <View style={styles.dateButtons}>
              {["2024-12-18", "2024-12-19", "2024-12-20"].map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateButton,
                    selectedDate === date && styles.dateButtonActive,
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      selectedDate === date && styles.dateButtonTextActive,
                    ]}
                  >
                    {formatDate(date)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedDate && (
              <>
                <Text style={styles.dateLabel}>Выберите время:</Text>
                <View style={styles.timeGrid}>
                  {availableTimes.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeButton,
                        selectedTime === time && styles.timeButtonActive,
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text
                        style={[
                          styles.timeButtonText,
                          selectedTime === time && styles.timeButtonTextActive,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setRescheduleModalVisible(false);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
              >
                <Text style={styles.cancelModalButtonText}>Назад</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  (!selectedDate || !selectedTime) && styles.buttonDisabled,
                ]}
                onPress={confirmReschedule}
                disabled={!selectedDate || !selectedTime}
              >
                <Text style={styles.confirmButtonText}>Перенести</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ACCBFA",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
  },
  recordCard: {
    backgroundColor: "#E8F0FC",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#85b3f7ff",
  },
  recordPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ACCBFA",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  masterName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  rescheduleButton: {
    backgroundColor: "#85b3f7ff",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff6b6b",
  },
  rescheduleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#ff6b6b",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  reasonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelModalButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  confirmButton: {
    backgroundColor: "#ACCBFA",
  },
  buttonDisabled: {
    backgroundColor: "#cfd8e6",
  },
  cancelModalButtonText: {
    color: "#666",
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    marginTop: 10,
  },
  dateButtons: {
    marginBottom: 10,
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ACCBFA",
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  dateButtonActive: {
    backgroundColor: "#ACCBFA",
  },
  dateButtonText: {
    color: "#333",
  },
  dateButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeButton: {
    width: "48%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ACCBFA",
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  timeButtonActive: {
    backgroundColor: "#ACCBFA",
  },
  timeButtonText: {
    color: "#333",
  },
  timeButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});