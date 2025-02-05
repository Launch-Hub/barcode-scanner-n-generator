import React, {useState} from 'react';
import {View, Dimensions, Text, SafeAreaView} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Button, Dialog} from '@rneui/themed';
import {RNCamera} from 'react-native-camera';
import {TextInput} from 'react-native-paper';
import styles from '../styles';

function BarcodeScan({navigation}) {
  const [flash, setFlash] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [barType, setBarType] = useState('');

  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const [json, setJson] = useState([]);

  const onGoogleVisionBarcodesDetected = ({barcodes}) => {
    if (!scanned && barcodes.length > 0 && barcodes[0].format != 'QR_CODE') {
      setScanned(true);
      navigation.navigate('ProductList', {scannedCode: barcodes[0]});
      // setBarcode(barcodes[0].data);
      // setBarType(barcodes[0].format);
    }
  };

  // const handleCopyToClipboard = () => {
  //   Clipboard.setString(JSON.stringify(json));
  // };

  // const handleAddToClipboard = () => {
  //   const data = {name, price, unit, note, barcode};
  //   if (json.length === 0 || !json.some(item => item.barcode === barcode)) {
  //     setJson([...json, data]);
  //     alert('Item added');
  //   } else {
  //     setShowAlert(true);
  //   }
  // };

  // const handleOverride = () => {
  //   setJson(json.map(e => (e.barcode === barcode ? {name, price, unit, note, barcode} : e)));
  //   setShowAlert(false);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <RNCamera
        captureAudio={false}
        mirrorImage={false}
        defaultTouchToFocus
        ref={ref => (this.camera = ref)}
        type={RNCamera.Constants.Type.back}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        flashMode={flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        onGoogleVisionBarcodesDetected={onGoogleVisionBarcodesDetected}
        style={{
          flex: 1,
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />

      <View style={{height: 100}}>
        <Button
          title={`Flash ${flash ? 'OFF' : 'ON'}`}
          onPress={() => setFlash(!flash)}
          icon={{...styles.home.iconButton, size: 28, name: 'flash'}}
          containerStyle={{...styles.home.buttonContainer, marginVertical: 20}}
          titleStyle={styles.home.titleButton}
          iconContainerStyle={styles.home.iconButtonContainer}
          buttonStyle={styles.home.button}
        />
      </View>

      {/* <Dialog isVisible={scanned} onBackdropPress={() => setScanned(!scanned)}>
        <Dialog.Title titleStyle={{color: '#000', fontSize: 25}} title="Scanned Barcode:" />
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
        <Dialog.Actions>
          <Button onPress={handleAddToClipboard} color={'success'} style={styles.home.button}>
            Add Item
          </Button>
          <Button onPress={handleCopyToClipboard} color={'primary'} style={styles.home.button}>
            Copy To Clipboard
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog isVisible={showAlert} onBackdropPress={() => setShowAlert(!showAlert)}>
        <Dialog.Title titleStyle={{color: '#000', fontSize: 25}} title="ALERT" />
        <Text style={{fontSize: 18}}>{`Item is already existed! OVERRIDE???`}</Text>
        <Dialog.Actions>
          <Button onPress={() => setShowAlert(!showAlert)} color={'error'}>
            NO
          </Button>
          <Button onPress={handleOverride} color={'success'}>
            YES
          </Button>
        </Dialog.Actions>
      </Dialog> */}
    </SafeAreaView>
  );
}

export default BarcodeScan;
