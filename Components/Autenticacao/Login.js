import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../Services/api'

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("rafaelflorindo@hotmail.com");
  const [senha, setSenha] = useState("123");

  const handleSubmit = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, senha });
      const usuario = JSON.stringify(response.data)

      if (response.data.token) {
        Alert.alert("Sucesso", "Usuário logado com sucesso!");
        setEmail("");
        setSenha("");

        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('usuario', usuario);

        
                
        /*navigation.navigate("Main", { 
          screen: 'Home', 
          params: {
            usuario: usuario,
            teste: "teste123"
          } 
        });*/
       
        // navigation.replace("Main", { usuario });
        navigation.replace("Main");

      } else {
        Alert.alert("Erro", "Credenciais inválidas.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Não foi possível fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imglogin}>
      <Image 
        source={require('../../assets/estoque.png')} 
        style={{ width: 100, height: 100 }} 
      />
      </View>
      <View style={styles.login}>
        <Text style={styles.title}>Faça o Login</Text>
        <Text style={styles.descricao}>Para acessar utilize o seu e-mail de cadastro e digite a sua senha.</Text>
        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="Digite sua senha"
          secureTextEntry
        />
       <View style={styles.viewRecuperarSenha}>
          <Text style={styles.textRecuperarSenha}>Recuperar Senha</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#68a66d",
  },
  imglogin:{
    flex: 1,
    width: '100%', 
    padding: 20,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "##68a66d",
  },
  login:{
    padding: 20,
    height: '400px',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#222",
    textAlign: "center",
  },
    descricao:{
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    color: "#999",
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
  },
  viewRecuperarSenha: {
    justifyContent: 'center', 
    alignItems: 'flex-end', 
  },
  textRecuperarSenha: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    color: "#444",
    textAlign: 'left', 
  }
});

export default Login;
