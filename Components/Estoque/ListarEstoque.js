// screens/ListarEstoque.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../../Services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProductItem from './ProductItem.js'; // Importe o novo componente

import { Ionicons } from '@expo/vector-icons'; // Para o ícone do FAB

export default function ListarEstoque({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true); // Adicionar estado de loading

  const fetchProdutos = async () => {
    setLoading(true); // Iniciar loading
    const tokenLogin = await AsyncStorage.getItem('token');
    try {
      const response = await api.get('/estoques/listAll', {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
        },
      });
      console.log('Produtos recebidos:', response.data);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar os produtos no estoque:', error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos do estoque.');
    } finally {
      setLoading(false); // Finalizar loading
    }
  };

  const handleDelete = async (id) => { // Renomeado para handleDelete
    const tokenLogin = await AsyncStorage.getItem('token');
    try {
      await api.delete(`/estoques/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
        },
      });
      Alert.alert('Sucesso', 'Produto excluído com sucesso!');
      fetchProdutos(); // Atualiza a lista após exclusão
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
      Alert.alert('Erro', 'Erro ao excluir o produto!!!');
    }
  };

  const handleEdit = (id) => {
    navigation.navigate('Editar', { id: id });
  };

  useEffect(() => {
    fetchProdutos();
    // Adicionar um listener para recarregar quando a tela estiver focada
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProdutos();
    });
    return unsubscribe; // Limpar o listener ao desmontar
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos em Estoque</Text>

      {loading ? (
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      ) : produtos.length === 0 ? (
        <Text style={styles.emptyListText}>Nenhum produto em estoque. Cadastre um!</Text>
      ) : (
        <FlatList
          style={styles.containerFlatlist}
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductItem
              item={item}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
          contentContainerStyle={styles.flatListContent}
        />
      )}

      {/* Floating Action Button (FAB) para Cadastrar */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CadastroEstoque')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Fundo mais suave
    paddingTop: 40, // Ajuste para o status bar
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26, // Título maior
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    alignSelf: 'center',
  },
  containerFlatlist: {
    width: '100%',
  },
  flatListContent: {
    paddingBottom: 80, // Espaço para o FAB não cobrir o último item
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  emptyListText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#007bff', // Cor primária para o FAB
    borderRadius: 30,
    elevation: 8, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});