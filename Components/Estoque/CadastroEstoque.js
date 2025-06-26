import React, { useState, useEffect } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from "../../Services/api";

const CadastroEstoque = ({ navigation }) => {
  const [marca, setMarca] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [precoCompra, setPrecoCompra] = useState("");
  const [lucro, setLucro] = useState("");

  const [produtos, setProdutos] = useState([]);
  const [selectedProdutoId, setSelectedProdutoId] = useState("0"); // Inicializa com "0" para a opção de placeholder

  useEffect(() => {
    const fetchProdutos = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await api.get('/produtos/listAll', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error.response?.data || error.message);
        Alert.alert("Erro", "Não foi possível carregar a lista de produtos.");
      }
    };

    fetchProdutos();
  }, []);

  const calcularPrecoVenda = (precoCompra, lucroPercentual) => {
    return precoCompra + (precoCompra * lucroPercentual) / 100;
  };

  const handleSubmit = async () => {
    const tokenLogin = await AsyncStorage.getItem('token');
    if (!tokenLogin) {
      Alert.alert("Erro de Autenticação", "Token de autenticação não encontrado.");
      return;
    }

    if (!marca || !descricao || !quantidade || !precoCompra || !lucro || selectedProdutoId === "0") { // Adicionado verificação para selectedProdutoId
      Alert.alert("Erro", "Preencha todos os campos e selecione um produto válido!");
      return;
    }

    const preco = parseFloat(precoCompra);
    const lucroPercentual = parseInt(lucro);
    const quantidadeNum = parseInt(quantidade);

    if (isNaN(preco) || isNaN(lucroPercentual) || isNaN(quantidadeNum)) {
      Alert.alert("Erro", "Verifique os valores numéricos inseridos (Quantidade, Preço de Compra, Lucro)!");
      return;
    }

    const precoVenda = calcularPrecoVenda(preco, lucroPercentual);

    // Objeto (payload) a ser enviado para o backend
    const payload = {
      marca,
      descricao,
      quantidade: quantidadeNum,
      precoCompra: preco,
      lucro: lucroPercentual,
      precoVenda,
      ativo: 1, // <--- ADICIONADO: Campo 'ativo' que estava faltando
      produtoId: parseInt(selectedProdutoId), // <--- CORRIGIDO: Chave para 'produtoId' (camelCase)
    };

    console.log("Payload enviado para o backend:", payload); // Para depuração

    try {
      const response = await api.post("/estoques/create", payload, {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
          'Content-Type': 'application/json', // Garante que o tipo de conteúdo é JSON
        },
      });

      console.log("Resposta do backend:", response.data); // Para depuração

      Alert.alert("Sucesso", "Produto inserido no Estoque com sucesso!");

      // Limpa os campos após sucesso
      setMarca("");
      setDescricao("");
      setQuantidade("");
      setPrecoCompra("");
      setLucro("");
      setSelectedProdutoId("0"); // Reseta para a opção "Selecione um produto"

      navigation.navigate('ListarEstoque');
    } catch (error) {
      console.error("Erro ao cadastrar:", error.response?.data || error.message); // Log mais detalhado do erro
      Alert.alert("Erro", `Não foi possível inserir o produto no estoque. ${error.response?.data?.message || 'Verifique sua conexão ou tente novamente.'}`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Entrada de Produto no Estoque</Text>

      <Text style={styles.label}>Produto:</Text>
      <Picker
        selectedValue={selectedProdutoId}
        onValueChange={(itemValue) => setSelectedProdutoId(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Selecione um produto" value="0" />
        {produtos.map((produto) => (
          <Picker.Item key={produto.id} label={produto.nome} value={produto.id.toString()} />
        ))}
      </Picker>

      <Text style={styles.label}>Marca do Produto:</Text>
      <TextInput
        style={styles.input}
        value={marca}
        onChangeText={setMarca}
        placeholder="Digite a marca"
      />

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Digite a descrição"
      />

      <Text style={styles.label}>Quantidade:</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        placeholder="Digite a quantidade"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Preço de Compra:</Text>
      <TextInput
        style={styles.input}
        value={precoCompra}
        onChangeText={setPrecoCompra}
        placeholder="Digite o preço de compra"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Lucro (%):</Text>
      <TextInput
        style={styles.input}
        value={lucro}
        onChangeText={setLucro}
        placeholder="Digite a porcentagem de lucro"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
       <TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  content: {
    justifyContent: "center",
    flexGrow: 1,
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
    backgroundColor: "#0056b3",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },buttonCancel: {
  backgroundColor: "#6c757d", // Uma cor cinza para "Cancelar"
  paddingVertical: 14,
  borderRadius: 6,
  alignItems: "center",
  marginTop: 10, // Espaçamento do botão Salvar
  marginBottom: 20, // Espaçamento inferior para o ScrollView
},
});

export default CadastroEstoque;