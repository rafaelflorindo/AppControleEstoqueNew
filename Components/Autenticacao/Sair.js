import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Sair({ navigation }) {
  const realizarLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['usuario', 'token']);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Erro ao sair do sistema:", error);
    }
  };

  useEffect(() => {
    realizarLogout();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saindo do Sistema...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
});
