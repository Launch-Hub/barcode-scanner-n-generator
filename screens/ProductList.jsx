import styles from '../styles';
import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
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
      marginRight: 8,
      marginVertical: 8,
      backgroundColor,
    }}>
    <Text style={{color: textColor, fontSize: 18, fontWeight: 500}}>
      {item.name} ({item.unit})
    </Text>
  </TouchableOpacity>
);

function ProductList({navigation, route}) {
  const {scannedCode, updatedItem, toast} = route?.params || {};

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  const [search, setSearch] = useState(null);
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
    const list = await fetchProducts({barcode: scannedCode});
    if (!list.length) {
      setShowAlert(true);
    } else if (list.length == 1) {
      navigation.navigate('ProductDetail', {product: list[0]});
    } else {
      setTempList(list);
      setShowSelector(true);
    }
  };

  const handleAfterDetected = (action, product = null) => {
    setShowAlert(false);
    if (action == 'update' && !!product) {
      navigation.navigate('ProductDetail', {product: product});
    } else {
      navigation.navigate('ProductDetail', {justCode: scannedCode});
    }
  };

  useEffect(() => {
    asyncData();
  }, []);

  useEffect(() => {
    if (updatedItem == true) {
      Toast.show({
        type: 'success',
        text1: 'Thành công!',
        text2: toast.message,
      });
      !!toast.status && asyncData();
    }
    !!scannedCode && checkScannedCode();
  }, [route, scannedCode]);

  const productRenderItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        key={item.id}
        style={styles.home.card}
        onPress={() => navigation.navigate('ProductDetail', {product: item})}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 4,
            fontWeight: 'bold',
            color: !!item.name ? 'black' : '#aaa',
          }}>
          {item.name || '{Không tên}'}
        </Text>
        <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 4}}>
          Giá: {formatCurency(item.price)}/{item.unit}
        </Text>
        <Text style={{fontSize: 18, fontWeight: '500'}}>Barcode: {item.barcode}</Text>
      </TouchableOpacity>
    ),
    [],
  );

  const renderItem = useCallback(
    ({item}) => (
      <Item
        item={item}
        textColor="white"
        backgroundColor="#1BA3F2"
        onPress={() => handleAfterDetected('update', item)}
      />
    ),
    [],
  );

  // const renderItem = useCallback(
  //   ({item}) => (
  //     <Item
  //       item={item}
  //       textColor={item.id === tempProduct?.id ? 'white' : 'black'}
  //       backgroundColor={item.id === tempProduct?.id ? '#1BA3F2' : '#95D0F3'}
  //       onPress={() => {
  //         // setTempProduct(() => item);
  //         handleAfterDetected('update', item)
  //       }}
  //     />
  //   ),
  //   [tempProduct],
  // );

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <SearchBar
          disabled={loading}
          placeholder="Tìm kiếm sản phẩm..."
          style={styles.home.searchBar}
          containerStyle={styles.home.searchBarContainer}
          inputContainerStyle={styles.home.searchBarInputContainer}
          onBlur={() => search != null && asyncData()}
          onChangeText={text => setSearch(text)}
          lightTheme={true}
          value={search}
          round={true}
        />
        <FlatList
          refreshControl={<RefreshControl refreshing={loading} onRefresh={asyncData} />}
          nestedScrollEnabled
          data={products}
          renderItem={productRenderItem}
          keyExtractor={product => product.id}
          initialNumToRender={5}
          windowSize={5}
        />
        <View
          style={{
            gap: 16,
            padding: 16,
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'white',
          }}>
          <Button
            title="Tạo"
            onPress={() => navigation.navigate('ProductDetail')}
            icon={{...styles.home.buttonIcon, name: 'plus'}}
            containerStyle={styles.home.buttonContainer}
            titleStyle={styles.home.buttonTitle}
            buttonStyle={styles.home.button}
          />
          <Button
            title="Quét"
            onPress={() => navigation.navigate('BarcodeScanner', {fromScreen: 'ProductList'})}
            icon={{...styles.home.buttonIcon, name: 'barcode-scan'}}
            containerStyle={styles.home.buttonContainer}
            titleStyle={styles.home.buttonTitle}
            buttonStyle={styles.home.button}
          />
        </View>
      </SafeAreaView>

      <Dialog isVisible={showAlert} onBackdropPress={() => setShowAlert(!showAlert)}>
        <Dialog.Title titleStyle={{color: '#000', fontSize: 25}} title="Thông báo!" />
        <Text style={{fontSize: 18}}>Mã vạch chưa tồn tại sản phẩm. Bạn có muốn tạo sản phẩm mới?</Text>
        <Dialog.Actions>
          <Button
            title="OK"
            buttonStyle={{paddingHorizontal: 12}}
            containerStyle={{borderRadius: 8, marginStart: 8}}
            onPress={() => handleAfterDetected('create')}
            color={'primary'}
          />
        </Dialog.Actions>
      </Dialog>

      <Dialog isVisible={showSelector} onBackdropPress={() => setShowSelector(!showSelector)}>
        <Dialog.Title titleStyle={{color: '#000', fontSize: 25}} title="Cập nhật" />
        <Text style={{fontSize: 18}}>Chọn sản phẩm cần cập nhật:</Text>
        <FlatList
          nestedScrollEnabled
          style={{marginVertical: 8, maxHeight: Dimensions.get('window').height / 2, overflow: 'scroll'}}
          data={tempList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={tempProduct}
        />
        {/* <Dialog.Actions>
          <Button
            title="Huỷ"
            titleStyle={{fontSize: 18}}
            buttonStyle={{paddingHorizontal: 16, paddingVertical: 12}}
            containerStyle={{borderRadius: 8, marginStart: 16}}
            onPress={() => setShowSelector(false)}
            color={'error'}
          />
          <Button
            title="Xem"
            titleStyle={{fontSize: 18}}
            buttonStyle={{paddingHorizontal: 16, paddingVertical: 12}}
            containerStyle={{borderRadius: 8}}
            onPress={() => handleAfterDetected('update')}
            color={'primary'}
          />
        </Dialog.Actions> */}
      </Dialog>
    </>
  );
}

export default ProductList;
