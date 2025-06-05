import React, { useEffect, useState } from 'react';
import {  View, Text, StyleSheet, ScrollView  } from "react-native";
import api from '../../Services/api'
export default function Relatorio(){
    const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
    }
  };

  const totalProdutos = produtos.length;
  const totalQuantidade = produtos.reduce((soma, p) => soma + p.quantidade, 0);
  const valorTotalEstoque = produtos.reduce((soma, p) => soma + (p.quantidade * p.preco), 0);
  const produtoMaisCaro = produtos.reduce((maisCaro, p) => p.preco > maisCaro.preco ? p : maisCaro, { preco: 0 });
  const produtoMaisBarato = produtos.reduce((maisBarato, p) => p.preco < maisBarato.preco ? p : maisBarato, { preco: Infinity });
  const produtoMaiorQtd = produtos.reduce((maiorEstoque, p) => p.quantidade > maiorEstoque.quantidade ? p : maiorEstoque, { quantidade: 0 });
  const produtosBaixoEstoque = produtos.filter(p => p.quantidade < 5);
  const produtosAcima100 = produtos.filter(p => p.preco > 100);
  const percentualBaixoEstoque = totalProdutos > 0 ? (produtosBaixoEstoque.length / totalProdutos * 100).toFixed(1) : 0;

  const produtoMaiorValorEstoque = produtos.reduce((maisValioso, p) => {
    const valorAtual = p.preco * p.quantidade;
    const valorMaisValioso = maisValioso.preco * maisValioso.quantidade;
    return valorAtual > valorMaisValioso ? p : maisValioso;
  }, { preco: 0, quantidade: 0 });

  const mediaPreco = totalProdutos > 0
    ? produtos.reduce((soma, p) => soma + p.preco, 0) / totalProdutos
    : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Dashboard de Produtos</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total de produtos cadastrados:</Text>
        <Text style={styles.value}>{totalProdutos}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Quantidade total em estoque:</Text>
        <Text style={styles.value}>{totalQuantidade}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Valor total em estoque (R$):</Text>
        <Text style={styles.value}>{valorTotalEstoque.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produto com maior quantidade:</Text>
        <Text style={styles.value}>{produtoMaiorQtd.nome} ({produtoMaiorQtd.quantidade})</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produto mais caro:</Text>
        <Text style={styles.value}>{produtoMaisCaro.nome} (R$ {produtoMaisCaro.preco.toFixed(2)})</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produto mais barato:</Text>
        <Text style={styles.value}>{produtoMaisBarato.nome} (R$ {produtoMaisBarato.preco.toFixed(2)})</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produtos com estoque abaixo de 5 unidades:</Text>
        {produtosBaixoEstoque.length > 0 ? (
          produtosBaixoEstoque.map((p, index) => (
            <Text key={index} style={styles.value}>
              {p.nome} - {p.quantidade} un. (R$ {p.preco.toFixed(2)})
            </Text>
          ))
        ) : (
          <Text style={styles.value}>Todos os estoques estão OK ✅</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Média de preço dos produtos:</Text>
        <Text style={styles.value}>R$ {mediaPreco.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produtos com preço acima de R$ 100:</Text>
        {produtosAcima100.length > 0 ? (
          produtosAcima100.map((p, i) => (
            <Text key={i} style={styles.value}>
              {p.nome} - R$ {p.preco.toFixed(2)}
            </Text>
          ))
        ) : (
          <Text style={styles.value}>Nenhum produto acima de R$ 100</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Percentual com estoque baixo (&lt; 5):</Text>
        <Text style={styles.value}>{percentualBaixoEstoque}%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Produto com maior valor total:</Text>
        <Text style={styles.value}>
          {produtoMaiorValorEstoque.nome} - R$ {(produtoMaiorValorEstoque.preco * produtoMaiorValorEstoque.quantidade).toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3, // sombra no Android
    shadowColor: '#000', // sombra iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
});