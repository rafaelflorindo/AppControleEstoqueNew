import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../../Services/api'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListarUsuarios({navigation}) {
  const [usuarios, setUsuarios] = useState([]);
  const [permissao, setPermissao] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const resposta = await api.get('/usuarios'); // retorna lista
      setUsuarios(resposta.data);
    } catch (error) {
      console.error('Erro ao buscar os usuarios:', error);
    }
  };

  const buscarPermissaoUsuarioLogado = async () => {
    try {
      const usuarioLogado = await AsyncStorage.getItem('usuario'); // ou token
      if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        setPermissao(usuario.data.permissao); 
      }
    } catch (error) {
      console.error("Erro ao buscar permissão:", error);
    }
  };

  const Delete = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      Alert.alert("Sucesso", "Usuário excluído com sucesso!");
      fetchUsuarios(); // atualizar a lista
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      Alert.alert("Erro", "Erro ao excluir o usuário!!!");
    }
  };

  useEffect(() => {
    fetchUsuarios();
    buscarPermissaoUsuarioLogado();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários Cadastrados</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CadastroUsuario')}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <FlatList
        style={styles.containerFlatlist}
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productText}>Nome: {item.nome}</Text>
            <Text style={styles.productText}>Telefone: {item.telefone}</Text>
            <Text style={styles.productText}>E-mail: {item.email}</Text>

            {permissao === 'adm' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('EditarUsuario', { id: item.id })}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => Delete(item.id)}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
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