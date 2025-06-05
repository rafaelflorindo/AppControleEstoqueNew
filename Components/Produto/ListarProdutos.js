import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../../Services/api'

export default function ListarProdutos({navigation}) {
  const [produtos, setProdutos] = useState([]);

  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
    }
  };

  const Delete = async (id)=>{
    try {
      await api.delete(`/produtos/${id}`);
      Alert.alert("Sucesso", "Produto excluido com sucesso!");
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
      Alert.alert("Erro", "Erro ao excluir o produto!!!");
    }

  };

  useEffect(() => {
    fetchProdutos();
  }, [produtos]);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Produtos Cadastrados</Text>
      
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Cadastro')}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <FlatList
        style={styles.containerFlatlist}
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productText}>Nome: {item.nome}</Text>
            <Text style={styles.productText}>Quantidade: {item.quantidadeMinima}</Text>
            <Text style={styles.productText}>Descricao: R${item.descricao}</Text>
          
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} 
              onPress={()=>navigation.navigate('Editar',{id:item.id})}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} 
              onPress={()=>Delete(item.id)}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>          
          </View>
        )}
      />
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
  productItem: {
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productText: {
    fontSize: 16,
    color: '#555',
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
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});