import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  home: {
    searchBarContainer: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    searchBarInputContainer: {
      backgroundColor: 'white',
    },
    searchBar: {
      width: '100%',
    },
    card: {
      // backgroundColor: '#8DA2F5',
      borderWidth: 1,
      borderColor: '#8DA2F5',
      backgroundColor: '#fefefe',
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      padding: 12,
    },
    buttonContainer: {
      borderRadius: 8,
      flex: 1,
    },
    button: {
      backgroundColor: '#1BA3F2',
      borderColor: 'transparent',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 0,
      height: 60,
    },
    iconButton: {
      type: 'material-community',
      color: 'white',
      size: 24,
    },
    titleButton: {
      fontWeight: '700',
      fontSize: 20,
    },
  },

  detail: {
    input: {
      backgroundColor: '#FFFFFF',
      marginBottom: 16,
    },
    button: {
      backgroundColor: '#1BA3F2',
      borderColor: 'transparent',
    },
    buttonDanger: {
      backgroundColor: '#E3141A',
      borderColor: 'transparent',
    },
  },

  // ----------

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // margin: 30,
  },
  cameraContainer: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  input: {
    marginBottom: 12,
    fontSize: 20,
  },
});

export default styles;
