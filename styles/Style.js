import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
  },
  homeSearchBarContainer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  homeSearchBarInputContainer: {
    backgroundColor: 'white',
  },
  homeSearchBar: {
    width: '100%',
  },
  buttonHomeContainer: {
    marginHorizontal: 50,
    marginVertical: 20,
    width: 'auto',
  },
  iconButtonHome: {
    type: 'material-community',
    color: 'white',
    size: 30,
  },
  titleButtonHome: {
    fontWeight: '700',
    fontSize: 22,
  },
  buttonHome: {
    backgroundColor: '#0C8E4E',
    borderColor: 'transparent',
    borderRadius: 16,
    borderWidth: 0,
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    height: 60,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginLeft: 10,
  },
});

export default styles;
