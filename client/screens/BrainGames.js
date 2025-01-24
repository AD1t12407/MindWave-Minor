import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Board from '../components/Board';
import config from '../assets/config.json';

const BrainGames = () => {
  const [levelNo, setLevelNo] = useState(0);
  const [level, setLevel] = useState(config.levels[0]);

  const levelChange = ({ levelNo, level }) => {
    setLevelNo(levelNo);
    setLevel(level);
  };

  const { container, titleStyle, endGameStyle } = styles;

  if (levelNo === config.levels.length) {
    return (
      <View style={container}>
        <Animatable.Text
          style={endGameStyle}
          animation="rubberBand"
          easing="ease-out"
          iterationCount="infinite"
          duration={6000}
        >
          Congratulations!
        </Animatable.Text>
      </View>
    );
  } else {
    return (
      <View style={container}>
        <Animatable.Text
          style={titleStyle}
          animation="bounceInDown"
          delay={1500}
          duration={1500}
        >
          Level {levelNo + 1}
        </Animatable.Text>

        <Board
          width={3}
          height={3}
          level={level}
          onComplete={() => levelChange({ levelNo: levelNo + 1, level: config.levels[levelNo + 1] })}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212', // Dark background for the container
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleStyle: {
      fontSize: 25,
      marginBottom: 10,
      color: '#ffffff', // Light text color for visibility
    },
    endGameStyle: {
      fontSize: 40,
      color: '#ffffff', // Light text color for visibility
    },
  });
  
  export default BrainGames;
  