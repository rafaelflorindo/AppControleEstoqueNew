import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

import api from "../../Services/api"
import ListarProdutos from "./ListarProdutos";

const CadastroScreen = ({navigation}) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState("");
  
  const handleSubmit = async () => {
    if (!nome || !descricao || !quantidadeMinima) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    try {
      const response = await api.post("/produtos", {
        nome,
        descricao, // Convertendo para número
        quantidadeMinima: parseInt(quantidadeMinima), // Convertendo para número inteiro
      });
      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      console.log("Produto cadastrado com sucesso!");
      setNome("");
      setDescricao("");
      setQuantidadeMinima("");
     
      navigation.navigate('ListarProdutos');

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o produto.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Produto</Text>
      <Text style={styles.label}>Nome do Produto:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Digite a descrição"
      
      />
      <Text style={styles.label}>Quantidade Minima:</Text>
      <TextInput
        style={styles.input}
        value={quantidadeMinima}
        onChangeText={setQuantidadeMinima}
        placeholder="Digite a quantidadeMinima"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};
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

  }, 

}); 
export default CadastroScreen;