import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './Services/api'; // Certifique-se de que o caminho está correto
import { Ionicons } from '@expo/vector-icons'; // Para ícones visuais

export default function Home({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados dos produtos no estoque
  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    try {
      const tokenLogin = await AsyncStorage.getItem('token');
      if (!tokenLogin) {
        Alert.alert("Erro de Autenticação", "Token de autenticação não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      const response = await api.get('/estoques/listAll', {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
        }
      });
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar os produtos para o dashboard Home:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível carregar os dados para o dashboard Home.');
    } finally {
      setLoading(false);
    }
  }, []); // useCallback para otimização

  useEffect(() => {
    fetchProdutos();
    // Adicionar um listener para recarregar os dados quando a tela for focada (útil ao retornar de outras telas)
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProdutos();
    });
    return unsubscribe; // Limpar o listener ao desmontar o componente
  }, [navigation, fetchProdutos]); // Dependências do useEffect

  // Funções auxiliares para formatar valores
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // --- Métricas do Dashboard (adaptadas do Relatório) ---
  const hasProducts = produtos.length > 0;
  const totalProdutosCadastrados = produtos.length;
  const totalQuantidadeEmEstoque = hasProducts ? produtos.reduce((soma, p) => soma + p.quantidade, 0) : 0;
  const valorTotalEstoque = hasProducts ? produtos.reduce((soma, p) => soma + (p.quantidade * p.precoVenda), 0) : 0;
  const produtosBaixoEstoque = hasProducts ? produtos.filter(p => p.quantidade < 5) : [];
  const countProdutosBaixoEstoque = produtosBaixoEstoque.length;

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo(a) ao seu Gerenciador de Estoque!</Text>

      {/* Seção de Resumo do Estoque */}
      <Text style={styles.sectionTitle}>Visão Geral do Estoque</Text>
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Ionicons name="cube-outline" size={30} color="#007bff" />
          <Text style={styles.metricLabel}>Total de Produtos</Text>
          <Text style={styles.metricValue}>{totalProdutosCadastrados}</Text>
        </View>

        <View style={styles.metricCard}>
          <Ionicons name="layers-outline" size={30} color="#28a745" />
          <Text style={styles.metricLabel}>Total em Quantidade</Text>
          <Text style={styles.metricValue}>{totalQuantidadeEmEstoque}</Text>
        </View>

        <View style={styles.metricCard}>
          <Ionicons name="wallet-outline" size={30} color="#ffc107" />
          <Text style={styles.metricLabel}>Valor Total (Venda)</Text>
          <Text style={styles.metricValue}>{formatCurrency(valorTotalEstoque)}</Text>
        </View>

        <View style={[styles.metricCard, countProdutosBaixoEstoque > 0 ? styles.alertCard : {}]}>
          <Ionicons name="warning-outline" size={30} color={countProdutosBaixoEstoque > 0 ? "#dc3545" : "#6c757d"} />
          <Text style={styles.metricLabel}>Estoque Baixo</Text>
          <Text style={styles.metricValue}>{countProdutosBaixoEstoque}</Text>
        </View>
      </View>

      {countProdutosBaixoEstoque > 0 && (
        <TouchableOpacity 
          style={styles.lowStockAlert}
          onPress={() => navigation.navigate('Relatorio')} // Navega para o relatório
        >
          <Text style={styles.lowStockText}>
            ⚠️ {countProdutosBaixoEstoque} produto(s) com estoque abaixo do mínimo! Ver detalhes.
          </Text>
        </TouchableOpacity>
      )}

      {/* Seção de Ações Rápidas */}
      <Text style={styles.sectionTitle}>Ações Rápidas</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CadastroEstoque')}>
          <Ionicons name="add-circle-outline" size={35} color="#fff" />
          <Text style={styles.actionButtonText}>Nova Entrada</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ListarEstoque')}>
          <Ionicons name="list-outline" size={35} color="#fff" />
          <Text style={styles.actionButtonText}>Ver Estoque</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Relatorio')}>
          <Ionicons name="analytics-outline" size={35} color="#fff" />
          <Text style={styles.actionButtonText}>Relatórios</Text>
        </TouchableOpacity>
        
        {/* Exemplo de botão adicional para outras telas, se houver */}
        {/*
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('OutraTela')}>
          <Ionicons name="settings-outline" size={35} color="#fff" />
          <Text style={styles.actionButtonText}>Configurações</Text>
        </TouchableOpacity>
        */}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Fundo mais claro
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40, // Espaçamento superior
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
    marginBottom: 15,
    alignSelf: 'flex-start', // Alinha o título da seção à esquerda
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que os cards quebrem a linha
    justifyContent: 'space-between', // Espaço entre os cards
    width: '100%',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '48%', // Cerca de metade da largura para dois cards por linha
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  alertCard: {
    borderColor: '#dc3545', // Borda vermelha para estoque baixo
    borderWidth: 2,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
  lowStockAlert: {
    backgroundColor: '#fff3cd', // Fundo amarelo claro para alerta
    borderColor: '#ffc107',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  lowStockText: {
    fontSize: 15,
    color: '#856404', // Cor do texto do alerta
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#007bff', // Cor primária para os botões de ação
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '48%', // Dois botões por linha
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
});
