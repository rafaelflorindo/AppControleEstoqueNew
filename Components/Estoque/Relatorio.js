import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import api from '../../Services/api'; // Certifique-se de que o caminho está correto

export default function Relatorio() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    setLoading(true); // Inicia o carregamento
    try {
      const tokenLogin = await AsyncStorage.getItem('token'); // <<-- CORRIGIDO: Obtém o token aqui
      if (!tokenLogin) {
        Alert.alert("Erro de Autenticação", "Token de autenticação não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      const response = await api.get('/estoques/listAll', {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
        },
      });
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar os produtos para o relatório:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível carregar os dados do relatório.');
    } finally {
      setLoading(false); // Finaliza o carregamento, independentemente do sucesso ou erro
    }
  };

  // Funções auxiliares para formatar valores
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Verificações para evitar erros se a lista de produtos estiver vazia
  const hasProducts = produtos.length > 0;

  // Cálculo das métricas do relatório, usando precoVenda e lidando com listas vazias
  const totalProdutos = produtos.length;
  const totalQuantidade = hasProducts ? produtos.reduce((soma, p) => soma + p.quantidade, 0) : 0;
  const valorTotalEstoque = hasProducts ? produtos.reduce((soma, p) => soma + (p.quantidade * p.precoVenda), 0) : 0; // <<-- Usando precoVenda
  
  const produtoMaisCaro = hasProducts
    ? produtos.reduce((maisCaro, p) => p.precoVenda > maisCaro.precoVenda ? p : maisCaro, { precoVenda: 0, nome: '' }) // <<-- Usando precoVenda e nome
    : { nome: 'N/A', precoVenda: 0 };

  const produtoMaisBarato = hasProducts
    ? produtos.reduce((maisBarato, p) => p.precoVenda < maisBarato.precoVenda ? p : maisBarato, { precoVenda: Infinity, nome: '' }) // <<-- Usando precoVenda e nome
    : { nome: 'N/A', precoVenda: 0 };

  const produtoMaiorQtd = hasProducts
    ? produtos.reduce((maiorEstoque, p) => p.quantidade > maiorEstoque.quantidade ? p : maiorEstoque, { quantidade: 0, nome: '' }) // <<-- Usando nome
    : { nome: 'N/A', quantidade: 0 };

  const produtosBaixoEstoque = hasProducts ? produtos.filter(p => p.quantidade < 5) : [];
  const produtosAcima100 = hasProducts ? produtos.filter(p => p.precoVenda > 100) : []; // <<-- Usando precoVenda
  const percentualBaixoEstoque = totalProdutos > 0 ? (produtosBaixoEstoque.length / totalProdutos * 100).toFixed(1) : 0;

  const produtoMaiorValorEstoque = hasProducts
    ? produtos.reduce((maisValioso, p) => {
        const valorAtual = p.precoVenda * p.quantidade; // <<-- Usando precoVenda
        const valorMaisValioso = maisValioso.precoVenda * maisValioso.quantidade; // <<-- Usando precoVenda
        return valorAtual > valorMaisValioso ? p : maisValioso;
      }, { precoVenda: 0, quantidade: 0, nome: '' }) // <<-- Usando precoVenda e nome
    : { nome: 'N/A', precoVenda: 0, quantidade: 0 };

  const mediaPreco = hasProducts
    ? produtos.reduce((soma, p) => soma + p.precoVenda, 0) / totalProdutos // <<-- Usando precoVenda
    : 0;

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Carregando relatório...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Dashboard de Estoque</Text> {/* Título mais claro */}

      <View style={styles.card}>
        <Text style={styles.label}>Total de produtos cadastrados:</Text>
        <Text style={styles.value}>{totalProdutos}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Quantidade total em estoque:</Text>
        <Text style={styles.value}>{totalQuantidade}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Valor total do estoque (Preço Venda):</Text> {/* <<-- Rótulo mais específico */}
        <Text style={styles.value}>{formatCurrency(valorTotalEstoque)}</Text> {/* <<-- Usando formatCurrency */}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produto com maior quantidade em estoque:</Text>
        <Text style={styles.value}>{produtoMaiorQtd.nome} ({produtoMaiorQtd.quantidade} un.)</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produto mais caro (Preço Venda):</Text> {/* <<-- Rótulo mais específico */}
        <Text style={styles.value}>{produtoMaisCaro.nome} ({formatCurrency(produtoMaisCaro.precoVenda)})</Text> {/* <<-- Usando formatCurrency */}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produto mais barato (Preço Venda):</Text> {/* <<-- Rótulo mais específico */}
        <Text style={styles.value}>{produtoMaisBarato.nome} ({formatCurrency(produtoMaisBarato.precoVenda)})</Text> {/* <<-- Usando formatCurrency */}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produtos com estoque abaixo de 5 unidades:</Text>
        {produtosBaixoEstoque.length > 0 ? (
          produtosBaixoEstoque.map((p) => ( // <<-- Removido 'index' e usando p.id como key
            <Text key={p.id} style={styles.value}>
              {p.Produto?.nome || p.nome} - {p.quantidade} un. ({formatCurrency(p.precoVenda)})
            </Text>
          ))
        ) : (
          <Text style={styles.value}>Todos os estoques estão OK ✅</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Média de preço de venda dos produtos:</Text> {/* <<-- Rótulo mais específico */}
        <Text style={styles.value}>{formatCurrency(mediaPreco)}</Text> {/* <<-- Usando formatCurrency */}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produtos com preço de venda acima de R$ 100:</Text> {/* <<-- Rótulo mais específico */}
        {produtosAcima100.length > 0 ? (
          produtosAcima100.map((p) => ( // <<-- Removido 'i' e usando p.id como key
            <Text key={p.id} style={styles.value}>
              {p.Produto?.nome || p.nome} - {formatCurrency(p.precoVenda)}
            </Text>
          ))
        ) : (
          <Text style={styles.value}>Nenhum produto acima de R$ 100</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Percentual de produtos com estoque baixo (&lt; 5):</Text>
        <Text style={styles.value}>{percentualBaixoEstoque}%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produto com maior valor total em estoque:</Text> {/* <<-- Rótulo mais específico */}
        <Text style={styles.value}>
          {produtoMaiorValorEstoque.Produto?.nome || produtoMaiorValorEstoque.nome} - {formatCurrency(produtoMaiorValorEstoque.precoVenda * produtoMaiorValorEstoque.quantidade)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    paddingBottom: 30, // Adiciona um padding no final da rolagem
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 24, // Aumentado um pouco o tamanho do título
    fontWeight: 'bold',
    marginBottom: 20, // Aumentado o espaçamento inferior do título
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 4, // Sombra mais proeminente no Android
    shadowColor: '#000', // Sombra iOS
    shadowOpacity: 0.15, // Sombra mais proeminente no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    borderLeftWidth: 5, // Adicionado um destaque lateral
    borderLeftColor: '#007bff', // Cor para o destaque
  },
  label: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Cor mais escura para os valores
    lineHeight: 24, // Melhorar legibilidade de múltiplas linhas
  },
});
