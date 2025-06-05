import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

import api from '../../Services/api'

const CadastroUsuario = ({navigation}) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState('');
  const [reSenha, setReSenha] = useState("");
  
  const handleSubmit = async () => {
    if (!nome || !email || !senha || !reSenha || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if(senha !== reSenha){
      Alert.alert("Erro", "Campos de senha são diferentes e devem ser iguais!");
      return;
    }

    try {
      const response = await api.post("/usuarios", {nome, email, senha, telefone});

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      console.log("Usuário cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setReSenha("");
      navigation.navigate('ListarUsuarios');
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o Usuario.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuario</Text>
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
        placeholder="(DDD) 9xxxx-xxxx"
      />
      <Text style={styles.label}>E-mail:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Seu email you@exemplo.com"
      />
      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite a senha"
        secureTextEntry={true}
      />
      <Text style={styles.label}>Re-Senha:</Text>
      <TextInput
        style={styles.input}
        value={reSenha}
        onChangeText={setReSenha}
        placeholder="Digite novamente a sua senha"
        secureTextEntry={true}
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
export default CadastroUsuario;