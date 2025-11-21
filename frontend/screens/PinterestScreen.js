import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import PTR from "../assets/jsonData/PTR.json";
import TRENDS from "../assets/jsonData/trends.json";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PinterestScreen() {
  const [data, setData] = useState(PTR);
  const [selectedFilters, setSelectedFilters] = useState([]); // несколько #

  const toggleFavorite = (id) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, state: !item.state } : item
      )
    );
  };

  const toggleFilter = (value) => {
    // value === "all" сбрасывает всё
    if (value === "all") {
      setSelectedFilters([]);
      return;
    }

    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value) // убрать, если уже выбран
        : [...prev, value] // добавить новый
    );
  };

  const filteredData = useMemo(() => {
    // если нет выбранных фильтров — показываем всё
    if (selectedFilters.length === 0) return data;
    // если у карточки один tag
    return data.filter((item) => selectedFilters.includes(item.tag));
    // если у карточки массив тегов:
    // return data.filter((item) => item.tags?.some((t) => selectedFilters.includes(t)));
  }, [data, selectedFilters]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.img }}
        style={styles.image}
        resizeMode="cover"
      />
      <Pressable
        style={styles.heartButton}
        onPress={() => toggleFavorite(item.id)}
        hitSlop={10}
      >
        <Ionicons
          name={item.state ? "heart" : "heart-outline"}
          size={24}
          color={item.state ? "#ff6b6b" : "#ACCBFA"}
        />
      </Pressable>
    </View>
  );

  const renderFilter = (trend) => {
    const isAll = trend.value === "all";
    const isActive = isAll
      ? selectedFilters.length === 0
      : selectedFilters.includes(trend.value);

    return (
      <Pressable
        key={trend.id}
        style={[styles.filterChip, isActive && styles.filterChipActive]}
        onPress={() => toggleFilter(trend.value)}
      >
        <Text
          style={[
            styles.filterText,
            isActive && styles.filterTextActive,
          ]}
        >
          {trend.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Идеи с Pinterest</Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {TRENDS.map(renderFilter)}
        </ScrollView>
      </View>
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#E8F0FC",
    borderRadius: 20,
    width: "48%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 4,
  },
  filtersContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E8F0FC",
  },
  filtersScrollContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ACCBFA",
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  filterChipActive: {
    backgroundColor: "#ACCBFA",
  },
  filterText: {
    color: "#333",
    fontSize: 14,
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});