import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
  },
  iconButtonHomeContainer: {
    // marginRight: 10,
  },
  iconButtonHome: {
    type: 'material-community',
    color: 'white',
    size: 50,
  },
  titleButtonHome: {
    fontWeight: '700',
    fontSize: 25,
  },
  buttonHome: {
    backgroundColor: '#0C8E4E',
    borderColor: 'transparent',
    borderRadius: 16,
    borderWidth: 0,
    padding: 10,
    height: 100,
  },
  buttonHomeContainer: {
    marginHorizontal: 50,
    marginVertical: 20,
    width: 200,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginLeft: 10,
  },
});

export default styles;
