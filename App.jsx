import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './screens/Home';
import BarcodeScan from './screens/BarcodeScanner';
import ProductDetail from './screens/ProductDetail';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{title: 'Product List'}} />
        <Stack.Screen
          name="Product Details"
          component={ProductDetail}
          options={{title: 'Product Details'}}
        />
        <Stack.Screen
          name="Barcode Scanner"
          component={BarcodeScan}
          options={{title: 'Barcode Scanner'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
