import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../../Services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListarUsuarios({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [permissao, setPermissao] = useState(null);
  const [usuarioLogadoId, setUsuarioLogadoId] = useState(null); // opcional

  const fetchUsuarios = async () => {
    const tokenLogin = await AsyncStorage.getItem('token');

    try {
      const response = await api.get('/usuarios/listAll', {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
        }
      });


  setUsuarios(response.data.data); // <- Aqui está certo

    } catch (error) {
      console.error('Erro ao buscar os usuários:', error);
    }
  };

  const buscarPermissaoUsuarioLogado = async () => {
    try {
      const usuarioLogado = await AsyncStorage.getItem('usuario');
      if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        setPermissao(usuario.data.permissao);
        setUsuarioLogadoId(usuario.data.id); // caso queira impedir autoexclusão
      }
    } catch (error) {
      console.error("Erro ao buscar permissão:", error);
    }
  };

  const Ativar = async (id) => {
    const tokenLogin = await AsyncStorage.getItem('token');
    try {
      await api.put(`/usuarios/ativar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
        }
      });
      Alert.alert("Sucesso", "Usuario ativado com sucesso!");
      fetchUsuarios(); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao ativar o produto:', error);
      Alert.alert("Erro", "Erro ao ativar o produto!");
    }
  };

  const Inativar = async (id) => {
    const tokenLogin = await AsyncStorage.getItem('token');
    try {
      await api.put(`/usuarios/inativar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
        }
      });
      Alert.alert("Sucesso", "Usuario inativado com sucesso!");
      fetchUsuarios(); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao inativar o produto:', error);
      Alert.alert("Erro", "Erro ao inativar o produto!");
    }
  };

  useEffect(() => {
    buscarPermissaoUsuarioLogado();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUsuarios();
    });
    return unsubscribe;
  }, [navigation]);

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
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.nome}</Text>
            <Text style={styles.userInfo}>📞 {item.telefone}</Text>
            <Text style={styles.userInfo}>✉️ {item.email}</Text>

            {permissao === 'adm' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('EditarUsuario', { id: item.id })}
                >
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
  userItem: {
    marginBottom: 12,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
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
  },  ativarButton: {
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

});
