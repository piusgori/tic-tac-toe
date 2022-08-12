import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import bg from './assets/bg.jpeg';
import Cell from './components/Cell';

export default function App() {
  const emptyMap = [
    ['', '', ''], // row 1
    ['', '', ''], // row 2
    ['', '', ''], // row 3
  ]

  const copyArray = (original) => {
    return original.map((arr) => arr.slice());
  }
  const [map, setMap] = useState(emptyMap);
  const [currentTurn, setCurrentTurn] = useState('x');
  const [gameMode, setGameMode] = useState('LOCAL') //local, medium, easy

  const resetGame = () => {
    setMap(emptyMap);
    setCurrentTurn('x');
  }

  useEffect(() => {
    const winner = getWinner(map);
    if(winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }
  }, [map])

  const gameWon = (player) => {
    Alert.alert('Congratulations', `Player ${player} won`, [{ text: 'Restart', style:'default', onPress: resetGame }])
  }

  const onPress = (rowIndex, cellIndex) => {
    if (map[rowIndex][cellIndex] !== ''){
      return Alert.alert('Error', 'Position Already Occupied!');
    }
    setMap(prevMap => {
      const updatedMap = [...prevMap]
      updatedMap[rowIndex][cellIndex] = currentTurn;
      return updatedMap;
    })
    setCurrentTurn(currentTurn === 'x' ? 'o' : 'x'); 
    
  }

  const getWinner = (winnerMap) => {
    //rows
    for (let i = 0; i < 3; i++){
      const isRowWinning = winnerMap[i].every(cell => cell === 'x');
      const isRowOWinning = winnerMap[i].every(cell => cell === 'o');
      if(isRowWinning){
        return 'x';
      } 
      if (isRowOWinning){
        return 'o';
      }
    }
    
    //columns
    for (let c = 0; c < 3; c++){
      let isColumnXWinner = true;
      let isColumnOWinner = true;
      for (let r = 0; r < 3; r++){
        if(winnerMap[r][c] !== 'x'){
          isColumnXWinner = false;
        } 
        if (winnerMap[r][c] !== 'o'){
          isColumnOWinner = false;
        }
      }
      if(isColumnXWinner){
        return 'x';
      } 
      if (isColumnOWinner){
        return 'o';
      }
    }
    //diagonals
    
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;
    const diagonalDet = (i) => {
      return 3 - i - 1;
    }
    for(let i = 0; i < 3; i++){
      if(winnerMap[i][i] !== 'o'){
        isDiagonal1OWinning = false;
      }
      if(winnerMap[i][i] !== 'x'){
        isDiagonal1XWinning = false;
      }
      if(winnerMap[i][diagonalDet(Number(i))] !== 'o'){
        isDiagonal2OWinning = false;
      }
      if(winnerMap[i][diagonalDet(Number(i))] !== 'x'){
        isDiagonal2XWinning = false;
      }
    }
    if(isDiagonal1OWinning || isDiagonal2OWinning) {
      return 'o';
    }
    if(isDiagonal1XWinning || isDiagonal2XWinning) {
      return 'x';
    }
  }

  const checkTieState = () => {
    const isAtLeastOneEmpty = map.some(row => row.some(cell => cell === ''));
    if(!isAtLeastOneEmpty){
      Alert.alert('Tie', 'It is a Tie', [{ text: 'Restart', onPress: resetGame }])
    }
  }

  const botTurn = () => {
    //collect options
    const possiblePositions = [];
    map.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === ''){
          possiblePositions.push({ row: rowIndex, col: cellIndex })
        }
      }) 
    })

    let chosenOption;

    if(gameMode === 'BOT_MEDIUM'){
      //Attack
      possiblePositions.forEach((pos) => {
        const mapCopy = copyArray(map);
        mapCopy[pos.row][pos.cell] = 'o';
        const winner = getWinner(mapCopy);
        if(winner === 'o') {
          chosenOption = pos
        }
      })
  
      
      if(!chosenOption){
        //Defence
        possiblePositions.forEach((pos) => {
          const mapCopy = copyArray(map);
          mapCopy[pos.row][pos.cell] = 'x';
          const winner = getWinner(mapCopy);
          if(winner === 'x') {
            //defend position
            chosenOption = pos
          }
        })
      }
    }  


    //choose random
    if(!chosenOption) {
      chosenOption = possiblePositions[Math.floor(Math.random() * possiblePositions.length)]
    }

    if(chosenOption){
      onPress(chosenOption.row, chosenOption.col)
    }
  }  

  useEffect(() => {
    if(currentTurn === 'o' && gameMode !== 'LOCAL' ){
      botTurn();
    }
  }, [currentTurn, gameMode])

  const changeGameMode = (selectedMode) => {
    setGameMode(selectedMode);
  }

  return (
    <View style={styles.container}>
      <ImageBackground resizeMode='contain' style={styles.background} source={bg}>
        <Text style={styles.text}>Current Turn: {currentTurn.toUpperCase()}</Text>
        <View style={styles.map}>
          {map.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((cell, cellIndex) => <Cell cell={cell} cellIndex={cellIndex} onPress={onPress} rowIndex={rowIndex} key={cellIndex}></Cell>)}
              </View>
          ))}
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => changeGameMode('LOCAL')} style={[styles.button, { backgroundColor: gameMode === 'LOCAL' ? '#4F5686' : '#191F24' }]}><Text style={styles.buttonText}>Local</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => changeGameMode('BOT_EASY')} style={[styles.button, { backgroundColor: gameMode === 'BOT_EASY' ? '#4F5686' : '#191F24' }]}><Text style={styles.buttonText}>Easy</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => changeGameMode('BOT_MEDIUM')} style={[styles.button, { backgroundColor: gameMode === 'BOT_MEDIUM' ? '#4F5686' : '#191F24' }]}><Text style={styles.buttonText}>Medium</Text></TouchableOpacity>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  buttons: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
  },
  button: {
    margin: 10,
    backgroundColor: '#191F24',
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#242D34',
  },
  map: {
    width: '80%',
    aspectRatio: 1,
  }, 
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    fontSize: 24,
    color: 'white',
    position: 'absolute',
    top: 50,
  }
});