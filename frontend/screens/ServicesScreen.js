import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import Checkbox from "expo-checkbox";
import servicesData from "../assets/jsonData/servicesData.json";

export default function ServicesScreen() {
  const [expanded, setExpanded] = useState({});
  const [selected, setSelected] = useState({});
  const [currentStep, setCurrentStep] = useState(1); // для степера

  // переключение раскрытия категории
  const toggleCategory = (category) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  // выбор подуслуги
  const toggleService = (category, serviceName, price) => {
    setSelected((prev) => {
      const key = `${category}-${serviceName}`;
      const newSelected = { ...prev };
      if (newSelected[key]) delete newSelected[key];
      else newSelected[key] = price;
      return newSelected;
    });
  };

  // сумма
  const totalPrice = Object.values(selected).reduce((sum, price) => sum + price, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Выбор услуг</Text>
      {/* ===== ШАГИ ===== */}
      <View style={styles.stepper}>
        {["Выбор услуг", "Дата", "Подтверждение"].map((label, index) => {
          const step = index + 1;
          const active = step <= currentStep;
          return (
            <View key={label} style={styles.stepContainer}>
              <View style={styles.stepTop}>
                <View style={[styles.stepCircle, active && styles.stepActive]}>
                  <Text style={[styles.stepNumber, active && styles.stepNumberActive]}>{step}</Text>
                </View>
                {step < 3 && <View style={[styles.stepLine, active && styles.stepLineActive]} />}
              </View>
            </View>
          );
        })}
      </View>

      {/* ===== СПИСОК УСЛУГ ===== */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {Object.entries(servicesData).map(([category, services]) => (
          <View key={category} style={styles.category}>
            <TouchableOpacity onPress={() => toggleCategory(category)} style={styles.categoryHeader}>
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
                      disabled // 👈 отключаем прямое взаимодействие с чекбоксом
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

      {/* ===== ИТОГО + КНОПКА ===== */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>К оплате: {totalPrice} ₽</Text>
        <TouchableOpacity
          style={[styles.bookButton, totalPrice === 0 && styles.bookButtonDisabled]}
          disabled={totalPrice === 0}
          onPress={() => setCurrentStep((prev) => Math.min(prev + 1, 3))}
        >
          <Text style={styles.bookText}>Записаться</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginTop: 60 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#ACCBFA",
  },

  /* ===== СТЕПЕР ===== */
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  stepContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column", // теперь каждый шаг — вертикальный
  },

  stepTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",

  },

  stepActive: {
    borderColor: "#ACCBFA",
    backgroundColor: "#ACCBFA",
  },

  stepNumber: { color: "#999", fontWeight: "bold" },
  stepNumberActive: { color: "#fff" },

  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  stepLineActive: { backgroundColor: "#ACCBFA" },
  stepLabelActive: {
    color: "#ACCBFA",
    fontWeight: "600",
  },


  /* ===== СПИСОК ===== */
  scroll: { paddingBottom: 120 },
  category: { marginBottom: 10, borderBottomWidth: 1, borderColor: "#eee" },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#E8F0FC",
  },
  categoryTitle: { fontSize: 20, fontWeight: "600" },
  arrow: { fontSize: 20, color: "#85b3f7ff" },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  photo: { width: 50, height: 50, borderRadius: 8, marginRight: 10, marginLeft: 1 },
  info: { flex: 1 },
  serviceName: { fontSize: 16, marginLeft: 20 },
  price: { color: "gray", marginLeft: 20 },
  time: { color: "gray", marginLeft: 20 },

  /* ===== ИТОГО ===== */
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
  bookButtonDisabled: {
    backgroundColor: "#cfd8e6",
  },
  bookText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
