// components/ProductItem.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

const ProductItem = ({ item, onDelete, onEdit }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o produto "${item.Produto?.nome}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: () => onDelete(item.id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.Produto?.nome}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.productText}>Marca: </Text>
        <Text style={styles.productValue}>{item.marca}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.productText}>Descrição: </Text>
        <Text style={styles.productValue}>{item.descricao}</Text>
      </View>

      <View style={styles.quantityPriceContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.productText}>Quantidade: </Text>
          <Text style={styles.productQuantity}>{item.quantidade}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.productText}>Preço Compra: </Text>
          <Text style={styles.productValue}>{formatCurrency(item.precoCompra)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.productText}>Preço Venda: </Text>
          <Text style={styles.productSellingPrice}>{formatCurrency(item.precoVenda)}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(item.id)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productItem: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  productText: {
    fontSize: 15,
    color: '#555',
  },
  productValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  productQuantity: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
  productSellingPrice: {
    fontSize: 16,
    color: '#28a745', // Verde para o preço de venda
    fontWeight: 'bold',
  },
  quantityPriceContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Alinha os botões à direita
    marginTop: 15,
  },
  editButton: {
    backgroundColor: '#007bff', // Azul primário para editar
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Vermelho para excluir
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ProductItem;