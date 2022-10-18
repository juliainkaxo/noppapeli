import React from 'react';
import { Text, View, Pressable } from 'react-native'; 
import Entypo from "@expo/vector-icons/Entypo"
import styles from '../style/style'
import { useState, useEffect, useCallback } from 'react';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";



let board = [];
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3; 

export default function Gameboard() { 
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('');
    const [total, setTotal] = useState(0);
    const [sum, setSum] = useState(0);
    const [selectedDices, setSelectedDices] =
        useState(new Array(NBR_OF_DICES).fill(false));
    const [selectedPoints, setSelectedPoints] = useState(new Array(6).fill(false));

    const row = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
            row.push(
                <Pressable 
                    key={"row" + i}
                    onPress={() => selectDice(i)}>
                    <MaterialCommunityIcons
                        name={board[i]}
                        key={"row" + i}
                        size={70}
                        color={getDiceColor(i)}/>
                    </Pressable>
     );   
}

  const points = []

  for (let i = 1; i < NBR_OF_DICES + 2; i++) {
    points.push(
        <Pressable 
            key={"line" + i}
            onPress={() => selectPoints(i)}>
            <MaterialCommunityIcons
                name={"numeric-" + [i] + "-circle"}
                key={"line" + i}
                size={40}
                color={getPointColor(i)}/> 
            </Pressable>
  );   
  }

function selectPoints(i) {
    let points = [...selectedPoints];
    points[i] = selectedPoints[i] ? false : true;
    setSelectedPoints(points);
    
    let numberOfSelectedDices = 0
    for (let x = 0; x < 4; x++) {
      if(Number(board[x].slice(-1)) === (i) && selectedDices[x] === true) {
        let number = board.reduce((total,x) => (x=="dice-" + i ? total+1 : total), 0)
        numberOfSelectedDices++
        setSum(sum + i * number)
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
      } else if (nbrOfThrowsLeft === 0) {
        setStatus("Valite oikia numero")
    } 
  } 
}

function getPointColor(i) {
    return selectedPoints[i] ? "black" : "steelblue";
}

function getDiceColor(i) {
  if (board.every((val, i, arr) => val === arr[0])) {
    return "orange";
  }
  else {
    return selectedDices[i] ? "black" : "steelblue";
  }
}

function selectDice(i) {
  let dices = [...selectedDices];
  dices[i] = selectedDices[i] ? false : true;
  setSelectedDices(dices);
}

function throwDices(selectDice) {

  for (let i = 0; i < NBR_OF_DICES; i++) {
    if (!selectedDices[i]) {
      let randomNumber = Math.floor(Math.random() * 6 + 1);
      board[i] = 'dice-' + randomNumber;
  }
  }
  setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
}


function chechThrows() {
  if (board.every((val, i , arr) => val === arr[0]) && nbrOfThrowsLeft > 0) {

    setStatus('Game has not started yet');
  }
  else if (board.every((val, i , arr) => val === arr[0]) && nbrOfThrowsLeft === 0) {
    setStatus('All same numbers!');
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
}
  else if (nbrOfThrowsLeft === 0) {
    setStatus('Choose the numbers you want to choose from below');

  }
  else { 
    setStatus('Keep on throwing');
  }
}


useEffect (() => {
  chechThrows();

  if (nbrOfThrowsLeft < 0) {
    setNbrOfThrowsLeft(NBR_OF_THROWS-1);
  }
}, [nbrOfThrowsLeft]);

return(
    <View style={styles.gameboard}>
              <View style={styles.flex}>{row}</View>
      <Text style={styles.gameinfo}> Throws left: {nbrOfThrowsLeft}</Text> 
      <Text style={styles.gameinfo}>{status}</Text> 
      {/* <Text style={styles.gameinfo}>Total sum is:{sum}</Text>  */}
      <Pressable style={styles.button}
        onPress={() => throwDices()}>
          <Text style={styles.buttonText}>
            Throw dices
          </Text>
      </Pressable>
      <View style={styles.flex}>{points}</View>
      <Text>
        Tulos: {sum}
      </Text>

    </View>
  );
}