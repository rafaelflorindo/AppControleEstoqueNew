import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../../Services/api'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Para o ícone do FAB


export default function ListarProdutos({ navigation }) {
  const [produtos, setProdutos] = useState([]);


  const fetchProdutos = async () => {
    const tokenLogin = await AsyncStorage.getItem('token');
    console.log("Token" + tokenLogin);

    try {
      const response = await api.get('/produtos/listAll', {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
        }
      });
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
    }
  };

  const Ativar = async (id) => {
    const tokenLogin = await AsyncStorage.getItem('token');
    try {
      await api.put(`/produtos/ativar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
        }
      });
      Alert.alert("Sucesso", "Produto ativado com sucesso!");
      fetchProdutos(); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao ativar o produto:', error);
      Alert.alert("Erro", "Erro ao ativar o produto!");
    }
  };

  const Inativar = async (id) => {
    const tokenLogin = await AsyncStorage.getItem('token');
    try {
      await api.put(`/produtos/inativar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
        }
      });
      Alert.alert("Sucesso", "Produto inativado com sucesso!");
      fetchProdutos(); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao inativar o produto:', error);
      Alert.alert("Erro", "Erro ao inativar o produto!");
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Produtos Cadastrados</Text>
      <FlatList
        style={[styles.containerFlatlist, { color: 'red' }]}
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
  <Text style={styles.productName}>{item.nome}</Text>
  <Text style={styles.productInfo}>📦 Quantidade: {item.quantidadeMinima}</Text>
  <Text style={styles.productInfo}>📝 {item.descricao}</Text>

  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('Editar', { id: item.id })}>
      <Text style={styles.buttonText}>✏️ Editar</Text>
    </TouchableOpacity>

    {item.ativo ? (
      <TouchableOpacity style={styles.inativarButton} onPress={() => Inativar(item.id)}>
        <Text style={styles.buttonText}>❌ Inativar</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={styles.ativarButton} onPress={() => Ativar(item.id)}>
        <Text style={styles.buttonText}>✅ Ativar</Text>
      </TouchableOpacity>
    )}
     {/* Floating Action Button (FAB) para Cadastrar */}
      
  </View>
</View>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
  containerFlatlist: {
    width: '90%',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  productItem: {
    marginBottom: 12,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  ativarButton: {
    backgroundColor: '#007bff', // verde
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  inativarButton: {
    backgroundColor: '#dc3545', // vermelho
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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