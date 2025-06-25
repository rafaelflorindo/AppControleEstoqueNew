import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import api from '../../Services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PerfilUsuario = ({ navigation }) => {
  const [idUsuario, setIdUsuario] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [permissao, setPermissao] = useState('');

  useEffect(() => {
    const carregarUsuario = async () => {
      const usuarioString = await AsyncStorage.getItem('usuario');
      if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        setNome(usuario.nome);
        setEmail(usuario.email);
        setTelefone(usuario.telefone);
        setPermissao(usuario.permissao);
      }
    };
    carregarUsuario();
  }, []);

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');

    if (!nome || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      await api.put(`/usuarios/update/${idUsuario}`, { nome, telefone }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar seu perfil.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome"
      />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        placeholder="Digite seu telefone"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>E-mail (não editável):</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#e9ecef' }]}
        value={email}
        editable={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 25, textAlign: "center", color: "#222" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6, color: "#444" },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 18,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#0056b3",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default PerfilUsuario;
