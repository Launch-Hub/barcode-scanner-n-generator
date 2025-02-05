import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {Button, Dialog, Text} from '@rneui/themed';
import styles from '../styles';
import {TextInput} from 'react-native-paper';
import {createProduct, deleteProduct, updateProduct} from '../api/products';
import Toast from 'react-native-toast-message';
import {formatNumber, revertRawNumber} from '../utils';

function ProductDetail({navigation, route}) {
  const {product, justCode} = route?.params || {};
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const parseData = () => {
    setName(product.name || '');
    setNote(product.note || '');
    setUnit(product.unit || '');
    setBarcode(product.barcode || '');
    setPrice(formatNumber(product?.price?.toString() || ''));
    setBuyPrice(formatNumber(product?.buyPrice?.toString() || ''));
  };

  const handleAddItem = async () => {
    setLoading(true);
    const resp = await createProduct({
      name,
      note,
      unit,
      barcode,
      price: parseInt(revertRawNumber(price)) || 0,
      buyPrice: parseInt(revertRawNumber(buyPrice)) || 0,
      createDate: new Date().toISOString(),
      // productStatus: 0,
      // searchText: '',
    });
    if (!!resp && resp.type == 1) {
      Toast.show({
        type: 'success',
        text1: 'Thành công!',
        text2: resp.message,
      });
      setLoading(false);
      navigation.navigate('ProductList', {forceReload: true});
    } else {
      Toast.show({
        type: 'error',
        text1: 'Thất bại!',
        text2: resp?.message || 'Có lỗi xảy ra trong quá trình tạo.',
      });
      setLoading(false);
    }
  };

  const handleUpdateItem = async () => {
    setLoading(true);
    const resp = await updateProduct(product.id, {
      ...product,
      name,
      note,
      unit,
      barcode,
      price: parseInt(revertRawNumber(price)) || 0,
      buyPrice: parseInt(revertRawNumber(buyPrice)) || 0,
    });
    if (!!resp && resp.type == 1) {
      Toast.show({
        type: 'success',
        text1: 'Thành công!',
        text2: resp.message,
      });
      setLoading(false);
      navigation.navigate('ProductList', {forceReload: true});
    } else {
      Toast.show({
        type: 'error',
        text1: 'Thất bại!',
        text2: resp?.message || 'Có lỗi xảy ra trong quá trình cập nhật.',
      });
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    setLoading(true);
    setShowAlert(false);
    const resp = await deleteProduct(product.id);
    if (!!resp && resp.type == 1) {
      Toast.show({
        type: 'success',
        text1: 'Thành công!',
        text2: resp.message,
      });
      setLoading(false);
      navigation.navigate('ProductList', {forceReload: true});
    } else {
      Toast.show({
        type: 'error',
        text1: 'Thất bại!',
        text2: resp?.message || 'Có lỗi xảy ra trong quá trình xoá.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    !!product ? parseData() : !!justCode ? setBarcode(justCode) : () => {};
    // console.log('reached');
  }, [product, justCode]);

  return (
    <>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <ScrollView style={{flex: 1, padding: 16}}>
          <TextInput
            label="Tên"
            value={name}
            onChangeText={text => setName(text)}
            style={styles.detail.input}
          />
          <TextInput
            label="Giá bán"
            value={price}
            onChangeText={text => setPrice(formatNumber(text))}
            style={styles.detail.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Giá mua"
            value={buyPrice}
            onChangeText={text => setBuyPrice(formatNumber(text))}
            style={styles.detail.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Đơn vị"
            value={unit}
            onChangeText={text => setUnit(text)}
            style={styles.detail.input}
          />
          <TextInput
            label="Barcode"
            value={barcode}
            onChangeText={text => setBarcode(text)}
            style={styles.detail.input}
          />
          <TextInput
            label="Ghi chú"
            value={note}
            onChangeText={text => setNote(text)}
            style={styles.detail.input}
          />
        </ScrollView>
      )}
      <View style={{padding: 16, display: 'flex', flexDirection: 'row', gap: 16}}>
        <Button
          disabled={loading}
          buttonStyle={styles.detail.button}
          containerStyle={{borderRadius: 8, flex: 1}}
          title={!!product ? 'Cập Nhật' : 'Thêm mới'}
          onPress={!!product ? handleUpdateItem : handleAddItem}
        />
        {!!product && (
          <Button
            title="Xoá"
            disabled={loading}
            buttonStyle={styles.detail.buttonDanger}
            containerStyle={{borderRadius: 8}}
            onPress={() => setShowAlert(!showAlert)}
          />
        )}
      </View>

      <Dialog isVisible={showAlert} onBackdropPress={() => setShowAlert(!showAlert)}>
        <Dialog.Title titleStyle={{color: '#000', fontSize: 25}} title="Thông báo!" />
        <Text style={{fontSize: 18}}>Bạn muốn xoá sản phẩm hiện tại??</Text>
        <Dialog.Actions>
          <Button
            title="Huỷ"
            buttonStyle={{paddingHorizontal: 12}}
            titleStyle={styles.home.titleButton}
            containerStyle={{borderRadius: 8, marginStart: 8}}
            onPress={() => setShowAlert(!showAlert)}
            color={'error'}
          />
          <Button
            title="Chắc chắn"
            buttonStyle={{paddingHorizontal: 12}}
            titleStyle={styles.home.titleButton}
            containerStyle={{borderRadius: 8}}
            onPress={handleDeleteItem}
            color={'primary'}
          />
        </Dialog.Actions>
      </Dialog>
    </>
  );
}

export default ProductDetail;
