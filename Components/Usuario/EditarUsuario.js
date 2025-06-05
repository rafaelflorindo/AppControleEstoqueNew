import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import api from '../../Services/api'

import ListarUsuarios from "./ListarUsuarios";

const EditarUsuario = ({ route, navigation }) => {
  const { id } = route.params;

  const [nome, setNome] = useState();
  const [telefone, setTelefone] = useState();

  const fetchUsuarios = async () => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      const usuario = response.data;

      setNome(usuario.nome);
      setTelefone(usuario.telefone.toString());
      setPreco(usuario.preco.toString());
    } catch (error) {
      console.error('Erro ao buscar os usuarios:', error);
    }
  };
  useEffect(() => {
    fetchUsuarios();
  }, []);
  const handleSubmit = async () => {
    if (!nome || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    try {
      const response = await api.put(`/usuarios/${id}`, {
        nome,
        telefone
      });
      Alert.alert("Sucesso", "Usuário Alterado com sucesso!");
      navigation.navigate('ListarUsuarios');
    } catch (error) {
      console.error("Erro ao alterar:", error);
      Alert.alert("Erro", "Não foi possível alterar o usuario.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuário selecionado</Text>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />
      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        placeholder="Digite a telefone"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Alterar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>

    </View>
  )
}
const styles = StyleSheet.create({

  container: {

    flex: 1,

    padding: 20,

    justifyContent: "center",

    backgroundColor: "#f5f5f5", // cor de fundo leve 

  },

  title: {

    fontSize: 24,

    fontWeight: "bold",

    marginBottom: 25,

    color: "#222",

    textAlign: "center",

  },

  label: {

    fontSize: 16,

    fontWeight: "600",

    marginBottom: 6,

    color: "#444",

  },

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

    backgroundColor: "#0056b3", // azul mais escuro 

    paddingVertical: 14,

    borderRadius: 6,

    alignItems: "center",

    marginTop: 10,

  },

  buttonText: {

    color: "#fff",

    fontSize: 16,

    fontWeight: "bold",

  }, buttonCancel: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  }

});
export default EditarUsuario;
