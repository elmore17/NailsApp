import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Calendar } from "react-native-calendars";
import CheckIcon from "../assets/icons/check.svg";

export default function ServicesScreen() {
  const [expanded, setExpanded] = useState({});
  const [selected, setSelected] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Состояния для загрузки данных из API
  const [servicesData, setServicesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных из API при монтировании компонента
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch("http://localhost:8081/api/service");
        
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setServicesData(data);
      } catch (err) {
        console.error("Ошибка загрузки услуг:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // ===== логика выбора услуг =====
  const toggleCategory = (category) =>
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));

  const toggleService = (category, serviceName, price) => {
    setSelected((prev) => {
      const key = `${category}-${serviceName}`;
      const newSelected = { ...prev };
      if (newSelected[key]) delete newSelected[key];
      else newSelected[key] = price;
      return newSelected;
    });
  };

  const totalPrice = Object.values(selected).reduce((sum, price) => sum + price, 0);

  // ===== шаги =====
  const renderStepContent = () => {
    // --- 1. Услуги ---
    if (currentStep === 1) {
      // Отображение индикатора загрузки
      if (loading) {
        return (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#ACCBFA" />
            <Text style={styles.loadingText}>Загрузка услуг...</Text>
          </View>
        );
      }

      // Отображение ошибки
      if (error) {
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Ошибка загрузки: {error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setLoading(true);
                setError(null);
                // Повторная загрузка данных
                fetch("http://localhost:8080/api/service")
                  .then((response) => response.json())
                  .then((data) => setServicesData(data))
                  .catch((err) => setError(err.message))
                  .finally(() => setLoading(false));
              }}
            >
              <Text style={styles.retryText}>Повторить</Text>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            {Object.entries(servicesData).map(([category, services]) => (
              <View key={category} style={styles.category}>
                <TouchableOpacity
                  onPress={() => toggleCategory(category)}
                  style={styles.categoryHeader}
                >
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <Text style={styles.arrow}>{expanded[category] ? "▲" : "▼"}</Text>
                </TouchableOpacity>

                {expanded[category] &&
                  services.map((s) => {
                    const key = `${category}-${s.name}`;
                    const isChecked = !!selected[key];
                    return (
                      <TouchableOpacity
                        key={key}
                        style={styles.serviceItem}
                        onPress={() => toggleService(category, s.name, s.price)}
                        activeOpacity={0.7}
                      >
                        <Checkbox
                          value={isChecked}
                          color={isChecked ? "#ACCBFA" : undefined}
                          style={{ marginRight: 10 }}
                          disabled
                        />
                        <View style={styles.info}>
                          <Text style={styles.serviceName}>{s.name}</Text>
                          <Text style={styles.price}>{s.price} ₽</Text>
                          <Text style={styles.time}>{s.time} мин</Text>
                        </View>
                        <Image source={{ uri: s.photo }} style={styles.photo} />
                      </TouchableOpacity>
                    );
                  })}
              </View>
            ))}
          </ScrollView>

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>К оплате: {totalPrice} ₽</Text>
            <TouchableOpacity
              style={[styles.bookButton, totalPrice === 0 && styles.bookButtonDisabled]}
              disabled={totalPrice === 0}
              onPress={() => setCurrentStep(2)}
            >
              <Text style={styles.bookText}>Выбрать дату</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    // --- 2. Дата и время ---
    if (currentStep === 2) {
      const availableTimes = [
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ];

      return (
        <ScrollView
          contentContainerStyle={{ flex: 1, alignItems: "center", paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.header, { fontSize: 20, marginTop: 10 }]}>Выберите дату</Text>

          {/* Календарь */}
          <Calendar
            minDate={new Date().toISOString().split("T")[0]}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={
              selectedDate
                ? { [selectedDate]: { selected: true, selectedColor: "#ACCBFA" } }
                : {}
            }
            theme={{
              todayTextColor: "#ACCBFA",
              arrowColor: "#ACCBFA",
              textDayFontSize: 16,
              textMonthFontWeight: "bold",
              monthTextColor: "#333",
            }}
            style={styles.calendar}
          />

          {selectedDate && (
            <>
              <Text style={[styles.header, { fontSize: 20, marginTop: 10 }]}>
                Выберите время
              </Text>
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

          <View style={styles.totalContainer}>
            <TouchableOpacity
              style={[
                styles.bookButton,
                (!selectedDate || !selectedTime) && styles.bookButtonDisabled,
              ]}
              disabled={!selectedDate || !selectedTime}
              onPress={() => setCurrentStep(3)}
            >
              <Text style={styles.bookText}>Подтвердить</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    // --- 3. Подтверждение ---
    if (currentStep === 3) {
      return (
        <View style={styles.confirmContainer}>
          <View style={styles.successContent}>
            <CheckIcon width={120} height={120} />
            <Text style={styles.successText}>
              Вы успешно записались на{" "}
              {selectedDate.split('-').reverse().join('-')} в {selectedTime}
            </Text>
            <Text style={styles.successPrice}>Сумма: {totalPrice} ₽</Text>
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              setSelected({});
              setSelectedDate(null);
              setSelectedTime(null);
              setCurrentStep(1);
            }}
          >
            <Text style={styles.bookText}>Готово</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {currentStep === 1
          ? "Выбор услуг"
          : currentStep === 2
          ? "Выбор даты и времени"
          : "Подтверждение"}
      </Text>

      {/* Степпер */}
      <View style={styles.stepper}>
        {["Услуги", "Дата", "Подтверждение"].map((label, index) => {
          const step = index + 1;
          const active = step <= currentStep;
          const isClickable = step < currentStep; // можно возвращаться только на предыдущие шаги

          return (
            <TouchableOpacity
              key={label}
              style={styles.stepContainer}
              disabled={!isClickable}
              onPress={() => {
                if (isClickable) setCurrentStep(step);
              }}
              activeOpacity={0.6}
            >
              <View style={styles.stepTop}>
                <View
                  style={[
                    styles.stepCircle,
                    active && styles.stepActive,
                    isClickable && { borderColor: "#85b3f7ff" },
                  ]}
                >
                  <Text
                    style={[styles.stepNumber, active && styles.stepNumberActive]}
                  >
                    {step}
                  </Text>
                </View>
                {step < 3 && (
                  <View style={[styles.stepLine, active && styles.stepLineActive]} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {renderStepContent()}
    </View>
  );
}

// === стили ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ACCBFA",
    marginBottom: 10,
    marginTop: 50,
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  stepContainer: { alignItems: "center", flexDirection: "column" },
  stepTop: { flexDirection: "row", alignItems: "center" },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  stepActive: { borderColor: "#ACCBFA", backgroundColor: "#ACCBFA" },
  stepNumber: { color: "#999", fontWeight: "bold" },
  stepNumberActive: { color: "#fff" },
  stepLine: { width: 50, height: 2, backgroundColor: "#ccc", marginHorizontal: 5 },
  stepLineActive: { backgroundColor: "#ACCBFA" },

  scroll: { paddingBottom: 120 },
  category: { marginBottom: 10, borderBottomWidth: 1, borderColor: "#eee" },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#E8F0FC",
  },
  categoryTitle: { fontSize: 20, fontWeight: "600", color: "#85b3f7ff"},
  arrow: { fontSize: 20, color: "#85b3f7ff" },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  photo: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  info: { flex: 1, color: "#85b3f7ff"},
  serviceName: { fontSize: 16, marginLeft: 20 },
  price: { color: "gray", marginLeft: 20 },
  time: { color: "gray", marginLeft: 20 },

  totalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  totalText: { fontSize: 20, fontWeight: "bold", color: "#ACCBFA", marginBottom: 10 },
  bookButton: {
    backgroundColor: "#ACCBFA",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  bookButtonDisabled: { backgroundColor: "#cfd8e6" },
  bookText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 80,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: "#ACCBFA",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
  },
  timeButtonActive: { backgroundColor: "#ACCBFA" },
  timeButtonText: { color: "#333" },
  timeButtonTextActive: { color: "#fff", fontWeight: "bold" },

  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },
  successText: {
  fontSize: 18,
  color: "#333",
  textAlign: "center",
  marginTop: 20,
},
  confirmContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  paddingHorizontal: 20,
},

successContent: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},

successPrice: {
  fontSize: 20,
  color: "#ACCBFA",
  fontWeight: "bold",
  marginTop: 10,
},

doneButton: {
  position: "absolute",
  bottom: 30,
  backgroundColor: "#ACCBFA",
  paddingVertical: 12,
  paddingHorizontal: 60,
  borderRadius: 10,
},

doneButtonText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
},

});
