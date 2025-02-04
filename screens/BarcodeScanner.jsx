import React, {useState, useRef} from 'react';
import {View, Dimensions, Text} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Button, Dialog} from '@rneui/themed';
import styles from '../styles/Style';
import {RNCamera} from 'react-native-camera';
import {TextInput} from 'react-native-paper';

function BarcodeScan({navigation}) {
  const [barcode, setBarcode] = useState('');
  const [barType, setBarType] = useState('');
  const [flash, setFlash] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        captureAudio={false}
        mirrorImage={false}
        defaultTouchToFocus
        autoFocus={RNCamera.Constants.AutoFocus.on}
        flashMode={flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        // onBarCodeRead={readBarcode}
        onGoogleVisionBarcodesDetected={({barcodes}) => {
          if (barcodes.length > 0 && barcodes[0].format != 'QR_CODE' && !showDialog) {
            setBarcode(barcodes[0].data);
            setBarType(barcodes[0].format);
            setShowDialog(true);
          }
        }}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
        }}
        type={RNCamera.Constants.Type.back}
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
      <Button
        title={`Flash ${flash ? 'OFF' : 'ON'}`}
        onPress={() => setFlash(!flash)}
        icon={{...styles.iconButtonHome, size: 25, name: 'flash'}}
        iconContainerStyle={styles.iconButtonHomeContainer}
        titleStyle={{...styles.titleButtonHome, fontSize: 20}}
        buttonStyle={{...styles.buttonHome, height: 50}}
        containerStyle={{...styles.buttonHomeContainer, marginTop: 20, marginBottom: 10}}
      />

      <Dialog isVisible={showDialog} onBackdropPress={() => setShowDialog(!showDialog)}>
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
          <Button onPress={handleAddToClipboard} style={styles.button}>
            Add Item
          </Button>
          <Button onPress={handleCopyToClipboard} color={'success'}>
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
      </Dialog>
    </View>
  );
}

export default BarcodeScan;
