import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Dialog, Text} from '@rneui/themed';
import styles from '../styles';
import {TextInput} from 'react-native-paper';
import {createProduct, deleteProduct, updateProduct} from '../api/products';
import Toast from 'react-native-toast-message';
import {formatNumber, revertRawNumber} from '../utils';

function ProductDetail({navigation, route}) {
  const {product, justCode, scannedCode} = route?.params || {};
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const [hideBuyPrice, setHideBuyPrice] = useState(true);

  const parseData = () => {
    setName(product.name || '');
    setNote(product.note || '');
    setUnit(product.unit || '');
    setBarcode(product.barcode || '');
    setPrice(formatNumber(product?.price?.toString() || ''));
    setBuyPrice(formatNumber(product?.buyPrice?.toString() || ''));
  };

  const haveItChanged = () => {
    return !(
      product.name == name &&
      product.note == note &&
      product.unit == unit &&
      product.barcode == barcode &&
      product.price == price &&
      product.buyPrice == buyPrice
    );
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
    });
    if (!!resp && resp.type == 1) {
      setLoading(false);
      navigation.navigate('ProductList', {updatedItem: true, toast: {message: resp.message, status: true}});
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
    if (!haveItChanged()) {
      console.log('sss');

      navigation.navigate('ProductList', {updatedItem: flase});
      return;
    }
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
      setLoading(false);
      navigation.navigate('ProductList', {updatedItem: true, toast: {message: resp.message, status: true}});
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
      setLoading(false);
      navigation.navigate('ProductList', {updatedItem: true, toast: {message: resp.message, status: true}});
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
    if (!!scannedCode) setBarcode(scannedCode);
  }, [product, justCode, scannedCode]);

  return (
    <>
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'large'} />
        </View>
      )}
      <ScrollView style={{flex: 1, padding: 16}}>
        <TextInput
          disabled={loading}
          label="Tên"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.detail.input}
          autoFocus={!product}
          multiline
        />
        <TextInput
          label="Giá bán"
          value={price}
          onChangeText={text => setPrice(formatNumber(text))}
          style={styles.detail.input}
          keyboardType="numeric"
        />
        <TextInput
          label="V"
          value={buyPrice}
          onChangeText={text => setBuyPrice(formatNumber(text))}
          style={styles.detail.input}
          keyboardType="numeric"
          secureTextEntry={hideBuyPrice}
          right={
            <TextInput.Icon icon={hideBuyPrice ? 'eye-off' : 'eye'} onPress={() => setHideBuyPrice(!hideBuyPrice)} />
          }
        />
        <TextInput label="Đơn vị" value={unit} onChangeText={text => setUnit(text)} style={styles.detail.input} />
        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
          <TextInput
            label="Barcode"
            value={barcode}
            onChangeText={text => setBarcode(text)}
            style={{...styles.detail.input, flex: 1}}
          />
          <Button
            disabled={loading}
            buttonStyle={styles.detail.button}
            containerStyle={styles.detail.buttonContainer}
            onPress={() => navigation.navigate('BarcodeScanner', {fromScreen: 'ProductDetail', product})}
            icon={{...styles.home.buttonIcon, name: 'barcode-scan'}}
          />
        </View>
        <TextInput
          label="Ghi chú"
          value={note}
          onChangeText={text => setNote(text)}
          style={styles.detail.input}
          multiline
        />
      </ScrollView>
      <View style={{padding: 16, display: 'flex', flexDirection: 'row', gap: 16}}>
        <Button
          disabled={loading}
          buttonStyle={styles.detail.button}
          titleStyle={styles.detail.buttonTitle}
          containerStyle={{...styles.detail.buttonContainer, flex: 1}}
          title={!!product ? 'Cập Nhật' : 'Thêm mới'}
          onPress={!!product ? handleUpdateItem : handleAddItem}
        />
        {!!product && (
          <Button
            title="Xoá"
            disabled={loading}
            buttonStyle={{...styles.detail.button, ...styles.detail.buttonDanger}}
            titleStyle={styles.detail.buttonTitle}
            containerStyle={styles.detail.buttonContainer}
            onPress={() => setShowAlert(!showAlert)}
          />
        )}
      </View>

      <Dialog isVisible={showAlert} onBackdropPress={() => setShowAlert(!showAlert)}>
        <Dialog.Title titleStyle={{color: '#000', fontSize: 25}} title="Thông báo!" />
        <Text style={{fontSize: 18, marginBottom: 16}}>
          Bạn muốn xoá <Text style={{fontWeight: 'bold'}}>"{name}"</Text>?
        </Text>
        <Dialog.Actions>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button
              title="Xoá"
              buttonStyle={{paddingHorizontal: 16}}
              titleStyle={styles.home.buttonTitle}
              containerStyle={{borderRadius: 8}}
              onPress={handleDeleteItem}
              color={'error'}
            />
            <Button
              title="Không"
              buttonStyle={{paddingHorizontal: 12}}
              titleStyle={styles.home.buttonTitle}
              containerStyle={{borderRadius: 8}}
              onPress={() => setShowAlert(!showAlert)}
              color={'primary'}
            />
          </View>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}

export default ProductDetail;
