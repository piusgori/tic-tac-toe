import { StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Circle from './Circle';
import Cross from './Cross';

const Cell = ({ cell, onPress, rowIndex ,cellIndex }) => {
  return (
    <Pressable onPress={() => onPress(rowIndex, cellIndex)} style={styles.cell}>
        {cell.length > 0 ? cell === 'o' ? <Circle></Circle> : <Cross></Cross> : null}
    </Pressable>
  )
}

export default Cell;

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        padding: 12,
      },
})