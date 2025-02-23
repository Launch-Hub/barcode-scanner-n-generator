import styles from '../styles';
import React, {useState} from 'react';
import {View, Dimensions, SafeAreaView} from 'react-native';
import {Button} from '@rneui/themed';
import {RNCamera} from 'react-native-camera';

const qr_format = 'QR_CODE';

function BarcodeScan({navigation, route}) {
  const {fromScreen, product} = route?.params || {fromScreen: 'ProductList'};
  const [flash, setFlash] = useState(false);
  const [scanned, setScanned] = useState(false);

  const onGoogleVisionBarcodesDetected = ({barcodes}) => {
    if (!scanned && !!barcodes && barcodes.some(code => code.format != qr_format)) {
      setScanned(true);
      const firstTrueBarcode = barcodes.find(code => code.type != qr_format);
      navigation.navigate(fromScreen, {scannedCode: firstTrueBarcode.data, product});
    }
  };

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
          icon={{...styles.home.buttonIcon, size: 28, name: 'flash'}}
          containerStyle={{...styles.home.buttonContainer, marginVertical: 20}}
          titleStyle={styles.home.buttonTitle}
          iconContainerStyle={styles.home.buttonIconContainer}
          buttonStyle={styles.home.button}
        />
      </View>
    </SafeAreaView>
  );
}

export default BarcodeScan;
