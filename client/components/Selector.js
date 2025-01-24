import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Selector = ({ onPress }) => {
  const renderButton = ({ number, index, label }) => {
    const { buttonContainer, cellText } = styles;
    return (
      <TouchableOpacity key={index} onPress={() => onPress(number)}>
        <View style={buttonContainer}>
          <Text style={cellText}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const { selectorRow } = styles;

  return (
    <View>
      <View style={selectorRow}>
        {[...Array(4).keys()].map((number, index) =>
          renderButton({ number: number + 1, index, label: number + 1 })
        )}
        {renderButton({ number: 0, index: 99, label: 'C' })}
      </View>
      <View style={selectorRow}>
        {[...Array(9).keys()]
          .slice(4)
          .map((number, index) =>
            renderButton({ number: number + 1, index, label: number + 1 })
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorRow: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: 40 * 9,
    height: 40,
    marginTop: 15,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: '#e5efff',
    borderRadius: 2.5,
    borderWidth: 1.5,
    borderColor: '#c1d9ff',
    width: 63,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 30,
  },
});

export default Selector;
