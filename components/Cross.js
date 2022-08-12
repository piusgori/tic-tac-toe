import { View, StyleSheet } from 'react-native'
import React from 'react'

const Cross = () => {
  return (
    <View style={styles.cross}>
      <View style={styles.crossLine}></View>
      <View style={[styles.crossLine, styles.crossLineReversed]}></View>
    </View>
  )
}

export default Cross;

const styles = StyleSheet.create({
  cross: {
      flex: 1,
    },
    crossLine: {
      position: 'absolute',
      left: '40%',
      width: 10,
      height: '100%',
      backgroundColor: 'white',
      borderRadius: 5,
      transform: [
        { rotate: '45deg', }
      ],
    },
    crossLineReversed: {
      transform: [
        {rotate: '-45deg'}
      ],
    },
})