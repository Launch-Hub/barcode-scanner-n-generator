import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';

const ProductCard = ({product, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} className="m-2">
      <View className="bg-white p-4 rounded-lg shadow">
        <View className="space-y-2">
          <Text className="text-lg font-bold" numberOfLines={2}>
            {product.name}
          </Text>
          <Text className="text-sm text-gray-600">{product.identifier}</Text>
          <Text className="text-base font-bold text-blue-600">${product.price.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
