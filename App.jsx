import React from 'react';
import Toast from 'react-native-toast-message';
import { enableScreens } from 'react-native-screens';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ProductList from './screens/ProductList';
import BarcodeScan from './screens/BarcodeScanner';
import ProductDetail from './screens/ProductDetail';

const Stack = createNativeStackNavigator();
enableScreens();

function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ProductList"
          screenOptions={{
            headerTintColor: '#ffffff',
            headerTitleStyle: {color: '#ffffff'},
            headerStyle: {backgroundColor: '#1BA3F2'},
            headerShadowVisible: false,
          }}>
          <Stack.Screen name="ProductList" component={ProductList} options={{title: 'Danh sách sản phẩm'}} />
          <Stack.Screen name="ProductDetail" component={ProductDetail} options={{title: 'Chi tiết sản phẩm'}} />
          <Stack.Screen name="BarcodeScanner" component={BarcodeScan} options={{title: 'Quét mã'}} />
        </Stack.Navigator>
      </NavigationContainer>

      <Toast visibilityTime={5000} />
    </>
  );
}

export default App;
