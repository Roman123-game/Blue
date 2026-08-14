import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    marginTop: 15,
  },

  title: {
    fontSize: 16,
  },

  signalBox: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginVertical: 8,
  },

  inlineContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  inlineInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  inlineTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    color: '#333',
  },

  inlineValue: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },

  inlineLabel: {
    fontSize: 14,
    color: '#5f6b91',
  },

  bar: {
    width: 10,
    backgroundColor: '#222',
    borderRadius: 3,
  },

  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
