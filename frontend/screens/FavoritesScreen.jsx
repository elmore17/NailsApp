import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FavoritesScreen({ route, navigation }) {
  const { data, onToggleFavorite } = route.params || { data: [], onToggleFavorite: () => {} };

  const favorites = useMemo(
    () => data.filter((item) => item.state),
    [data]
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.img }} style={styles.image} resizeMode="cover" />
      <Pressable
        style={styles.heartButton}
        onPress={() => onToggleFavorite(item.id)}
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

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>У вас нет избранных идей</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ACCBFA",
    textAlign: "center",
    marginBottom: 20,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 80 },
  row: { justifyContent: "space-between", marginBottom: 15 },
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
  image: { width: "100%", height: 180 },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 4,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#999" },
});
