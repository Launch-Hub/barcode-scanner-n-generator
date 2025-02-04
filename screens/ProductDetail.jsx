import React, {useState, useRef} from 'react';
import {View, Dimensions, Text} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Button, Dialog} from '@rneui/themed';
import styles from '../styles/Style';
import {TextInput} from 'react-native-paper';

function ProductDetail({navigation}) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const [json, setJson] = useState([]);

  const handleCopyToClipboard = () => {
    Clipboard.setString(JSON.stringify(json));
  };

  const handleAddToClipboard = () => {
    const data = {name, price, unit, note, barcode};
    if (json.length === 0 || !json.some(item => item.barcode === barcode)) {
      setJson([...json, data]);
      alert('Item added');
    } else {
      setShowAlert(true);
    }
  };

  handleOverride = () => {
    setJson(json.map(e => (e.barcode === barcode ? {name, price, unit, note, barcode} : e)));
    setShowAlert(false);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{marginBottom: 4, fontSize: 18}}>{`Code (format: ${barType}):\n ${barcode}`}</Text>
      <TextInput
        label="Name"
        value={name}
        onChangeText={text => setName(text)}
        style={styles.input}
      />
      <TextInput
        label="Price"
        value={price}
        onChangeText={text => setPrice(text)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        label="Unit"
        value={unit}
        onChangeText={text => setUnit(text)}
        style={styles.input}
      />
      <TextInput
        label="Note"
        value={note}
        onChangeText={text => setNote(text)}
        style={styles.input}
      />
      <div>
        <Button onPress={handleAddToClipboard} style={styles.button}>
          Add Item
        </Button>
        <Button onPress={handleCopyToClipboard} color={'success'}>
          Copy To Clipboard
        </Button>
      </div>
    </View>
  );
}

export default ProductDetail;
