import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import data from "../assets/jsonData/AccountData.json";


export default function AccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Мой аккаунт</Text>

      {/* Фото и ID */}
      <View style={styles.profileBlock}>
        <Image
          source={{ uri: data.img }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{data.userName}</Text>
        </View>
      </View>

      {/* Кнопка "Мои записи" */}
      <TouchableOpacity style={styles.myRecordsButton}
      onPress={() => navigation.navigate('MyRecords')}
      >
        <Text style={styles.myRecordsText}>Мои записи</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.myRecordsButton}>
          <Text style={styles.myRecordsText}>Оплата</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.myRecordsButton}>
          <Text style={styles.myRecordsText}>Избранное</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ACCBFA",
    marginBottom: 30,
  },
  profileBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#E8F0FC",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  userInfo: {
    alignItems: "stretch",
  },
  userName: {
    fontSize: 18,
    color: "#85b3f7ff",
    fontWeight: "600",
  },
  myRecordsButton: {
    backgroundColor: "#ACCBFA",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 60,
    marginTop: 25,
    width: "90%",
    alignItems: "center",
  },
  myRecordsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  blocksContainer: {
    flexDirection: "col",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 40
  },
  block: {
    backgroundColor: "#E8F0FC",
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  blockText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#85b3f7ff",
  },
});
