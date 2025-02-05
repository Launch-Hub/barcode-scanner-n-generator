import styles from '../styles';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Dialog, SearchBar} from '@rneui/themed';
import {fetchProducts} from '../api/products';
import {formatCurency} from '../utils';
import Toast from 'react-native-toast-message';

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      padding: 16,
      borderRadius: 8,
      marginVertical: 8,
      marginHorizontal: 16,
      backgroundColor,
    }}>
    <Text style={{color: textColor}}>
      {item.name} ({item.unit})
    </Text>
  </TouchableOpacity>
);

function ProductList({navigation, route}) {
  const {scannedCode, forceReload} = route?.params || {};

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);
  const [tempList, setTempList] = useState([]);

  const asyncData = async () => {
    setLoading(true);
    const data = await fetchProducts({searchTerm: search});
    if (data) {
      setProducts(data);
      setLoading(false);
    } else {
      Toast.show({
        type: 'info',
        text1: 'Không tìm thấy sản phẩm!',
      });
      setLoading(false);
    }
    return data;
  };

  const checkScannedCode = async () => {
    if (!!scannedCode && scannedCode.data) {
      const list = await fetchProducts({barcode: scannedCode.data});
      if (!!list?.length) {
        setTempList(list);
        setShowAlert(true);
      } else {
        navigation.navigate('ProductDetail', {justCode: scannedCode.data});
      }
    }
  };

  const handleSelectProduct = product => {
    return () => {
      navigation.navigate('ProductDetail', {product});
    };
  };

  const handleAfterDetected = (action, product) => {
    setShowAlert(false);
    if (action == 'update') {
      navigation.navigate('ProductDetail', {product: product || tempProduct});
    } else {
      navigation.navigate('ProductDetail', {justCode: scannedCode.data});
    }
  };

  useEffect(() => {
    asyncData();
  }, [forceReload]);

  useEffect(() => {
    checkScannedCode();
  }, [scannedCode]);

  const renderItem = ({item}) => {
    const backgroundColor = item.id === tempProduct.id ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === tempProduct.id ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setTempProduct(item)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <>
      <View style={{flex: 1}}>
        <View>
          <SearchBar
            disabled={loading}
            placeholder="Tìm kiếm..."
            style={styles.home.searchBar}
            containerStyle={styles.home.searchBarContainer}
            inputContainerStyle={styles.home.searchBarInputContainer}
            onChangeText={text => setSearch(text)}
            onBlur={asyncData}
            lightTheme={true}
            value={search}
            round={true}
          />
          <Button
            disabled={loading}
            onPress={asyncData}
            icon={{...styles.home.iconButton, name: 'refresh'}}
          />
        </View>
        <ScrollView style={{flex: 1}}>
          {loading ? (
            <View
              style={{
                flex: 1,
                height: Dimensions.get('screen').height * 0.64,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={'large'} />
            </View>
          ) : (
            products.map((product, index) => (
              <TouchableOpacity
                key={product.id}
                style={styles.home.card}
                onPress={handleSelectProduct(product)}>
                <Text
                  style={{
                    fontSize: 20,
                    marginBottom: 4,
                    fontWeight: 'bold',
                    color: !!product.name ? 'black' : '#aaa',
                  }}>
                  {product.name || '{Không tên}'}
                </Text>
                <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 4}}>
                  Giá: {formatCurency(product.price)}/{product.unit}
                </Text>
                <Text style={{fontSize: 18, fontWeight: '500' /*marginBottom: 4*/}}>
                  Barcode: {product.barcode}
                </Text>
                {/* {product.note && (
                  <Text style={{fontSize: 16, fontStyle: 'italic', color: 'red'}}>
                    Ghi chú: {product.note}
                  </Text>
                )} */}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <View style={{display: 'flex', gap: 16, flexDirection: 'row', padding: 16}}>
          <Button
            title="Tạo"
            onPress={() => navigation.navigate('ProductDetail')}
            icon={{...styles.home.iconButton, name: 'plus'}}
            containerStyle={styles.home.buttonContainer}
            titleStyle={styles.home.titleButton}
            buttonStyle={styles.home.button}
          />
          <Button
            title="Quét"
            onPress={() => navigation.navigate('BarcodeScanner')}
            icon={{...styles.home.iconButton, name: 'barcode-scan'}}
            containerStyle={styles.home.buttonContainer}
            titleStyle={styles.home.titleButton}
            buttonStyle={styles.home.button}
          />
        </View>
      </View>

      <Dialog isVisible={showAlert} onBackdropPress={() => setShowAlert(!showAlert)}>
        <Dialog.Title titleStyle={{color: '#000', fontSize: 25}} title="Thông báo!" />
        <Text style={{fontSize: 18}}>
          Mã vạch đã tồn tại {tempList.length} sản phẩm. Bạn có muốn tạo sản phẩm mới với cùng mã
          vạch này?
        </Text>
        <Dialog.Actions>
          <Button
            title="Tạo mới"
            buttonStyle={{paddingHorizontal: 12}}
            containerStyle={{borderRadius: 8, marginStart: 8}}
            onPress={() => handleAfterDetected('create')}
            color={'primary'}
          />
          <Button
            title="Cập nhật"
            buttonStyle={{paddingHorizontal: 12}}
            containerStyle={{borderRadius: 8}}
            onPress={() => {
              setShowAlert(false);
              if (tempList.length == 1) {
                setTempProduct(tempList[0]);

                handleAfterDetected('update', tempList[0]);
              } else setShowSelector(true);
            }}
            color={'warning'}
          />
        </Dialog.Actions>
      </Dialog>

      <Dialog isVisible={showSelector} onBackdropPress={() => setShowSelector(!showSelector)}>
        <Dialog.Title titleStyle={{color: '#000', fontSize: 25}} title="Cập nhật" />
        <Text style={{fontSize: 18}}>Chọn sản phẩm cần cập nhật:</Text>
        <FlatList
          data={tempList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={tempProduct}
        />
        <Dialog.Actions>
          <Button
            title="Huỷ"
            buttonStyle={{paddingHorizontal: 12}}
            containerStyle={{borderRadius: 8, marginStart: 8}}
            onPress={() => setShowSelector(false)}
            color={'primary'}
          />
          <Button
            title="Cập nhật"
            buttonStyle={{paddingHorizontal: 12}}
            containerStyle={{borderRadius: 8}}
            onPress={() => handleAfterDetected('update', tempProduct)}
            color={'warning'}
          />
        </Dialog.Actions>
      </Dialog>
    </>
  );
}

export default ProductList;
