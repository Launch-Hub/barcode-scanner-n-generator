import * as React from 'react';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ProductList from './screens/ProductList';
import BarcodeScan from './screens/BarcodeScanner';
import ProductDetail from './screens/ProductDetail';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ProductList">
          <Stack.Screen
            name="ProductList"
            component={ProductList}
            options={{title: 'Danh sách sản phẩm'}}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetail}
            options={{title: 'Chi tiết sản phẩm'}}
          />
          <Stack.Screen
            name="BarcodeScanner"
            component={BarcodeScan}
            options={{title: 'Barcode Scanner'}}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <Toast visibilityTime={5000} />
    </>
  );
}

export default App;
