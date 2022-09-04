export default {
  game: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  title: {
    position: 'absolute',
    top: 0
  },
  sides: {
    display: 'flex',
    flexDirection: 'row',
  },
  side: {
    height: 300,
    width: 150,
    border: '1px solid black',
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  ball : {
    width: 100,
    height: 100,
    borderRadius: 50,
    color: '#fff',
    backgroundColor: 'red',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  }
}