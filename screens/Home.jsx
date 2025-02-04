import React, {useEffect, useState} from 'react';
import {ToastAndroid, View} from 'react-native';
import {Button, SearchBar} from '@rneui/themed';
import styles from '../styles/Style';
import {fetchProducts} from '../api/products';

function Home({navigation}) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const asyncData = async () => {
    setLoading(true);
    const data = await fetchProducts({name: search});
    if (data) {
      setProducts(data);
      setLoading(false);
    } else {
      ToastAndroid.showWithGravity('No Product Found!', ToastAndroid.SHORT, ToastAndroid.CENTER);
      setLoading(false);
    }
  };

  const handleSearch = async text => {
    setSearch(text);
  };

  useEffect(() => {
    asyncData();
  }, [search]);

  return (
    <>
      <SearchBar
        style={styles.homeSearchBar}
        containerStyle={styles.homeSearchBarContainer}
        inputContainerStyle={styles.homeSearchBarInputContainer}
        lightTheme={true}
        round={true}
        placeholder="Find Product..."
        onChangeText={handleSearch}
        showLoading={loading}
        value={search}
      />
      <View style={styles.container}>
        <Button
          title="Scan"
          onPress={() => navigation.navigate('Barcode Scanner')}
          icon={{...styles.iconButtonHome, name: 'barcode-scan'}}
          iconContainerStyle={styles.iconButtonHomeContainer}
          titleStyle={styles.titleButtonHome}
          buttonStyle={styles.buttonHome}
          containerStyle={styles.buttonHomeContainer}
        />
      </View>
    </>
  );
}

export default Home;
