import { View, StyleSheet } from 'react-native'
import React from 'react'

const Circle = () => {
  return (
    <View style={styles.circle}></View>
  )
}

export default Circle;

const styles = StyleSheet.create({
  circle: {
      flex: 1,
      borderRadius: 50,
      borderColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 10,
      borderWidth: 10,
    },
})