import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeCard: {
    marginTop: -82,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f2f4ff',
    alignItems: 'flex-start',
  },
  gaugeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5b8a',
    marginBottom: 4,
  },
  gaugeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2b4d',
  },
  box: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 12,
  },
  connectedContainer: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginTop: -18,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e1e4ee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  strengthWrap: {
    minWidth: 120,
  },

  separator: {
    width: 1,
    height: 40,
    backgroundColor: '#e1e4ee',
    marginHorizontal: 12,
    alignSelf: 'center',
  },

  batteryWrap: {
    marginLeft: 0,
  },
  carWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomRow: {
    alignItems: 'center',
    position: 'relative',
    bottom: 30,
    zIndex: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
