import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import Selector from './Selector';

// Create a custom animation
export const pulseMore = {
  0: { scale: 1 },
  0.5: { scale: 1.2 },
  1: { scale: 1 },
};
Animatable.initializeRegistryWithDefinitions({ pulseMore });

const Board = ({ width, height, level, onComplete }) => {
  const createGrid = (width, height) => {
    return Array(width * height)
      .fill()
      .map(() =>
        new Array(width * height).fill().map(() => ({
          value: 0,
          notes: [],
          duplicate: false,
          error: 0,
          locked: false,
        }))
      );
  };

  const readLevel = ({ level, grid }) => {
    level.split('|').forEach((row, rowIdx) => {
      row.split('').forEach((cell, colIdx) => {
        if (cell === '.') {
          grid[colIdx][rowIdx].value = 0;
        } else {
          grid[colIdx][rowIdx].value = Number(cell);
          grid[colIdx][rowIdx].locked = true;
        }
      });
    });
  };

  const reset = ({ width, height, level }) => {
    const grid = createGrid(width, height);
    if (level) {
      readLevel({ level, grid });
      if (typeof checkErrors === 'function') {
        checkErrors({ grid });
      }
    }
    return { grid, selected: null };
  };

  const [state, setState] = useState(reset({ width, height, level }));

  useEffect(() => {
    setState(reset({ width, height, level }));
  }, [width, height, level]);

  const countItems = ({ grid, prop, value }) => {
    return grid.reduce(
      (total, currentRow) =>
        total +
        currentRow.reduce((colTotal, currentCell) => {
          if (currentCell[prop] === value) return colTotal + 1;
          return colTotal;
        }, 0),
      0
    );
  };

  const getRegion = ({ grid, regionRow = null, regionCol = null }) => {
    return grid.reduce((previousRow, currentRow, rowIdx) => {
      currentRow.forEach((cell, colIdx) => {
        if (regionRow === null && colIdx === regionCol) {
          previousRow.push(cell);
        } else if (regionCol === null && rowIdx === regionRow) {
          previousRow.push(cell);
        } else if (
          regionRow === Math.floor(rowIdx / width) &&
          regionCol === Math.floor(colIdx / height)
        ) {
          previousRow.push(cell);
        }
      });
      return previousRow;
    }, []);
  };

  const clearErrors = (grid) => {
    grid.forEach((row) => {
      row.forEach((cell) => {
        cell.duplicate = false;
        cell.error = 0;
      });
    });
  };

  const checkDuplicates = (region) => {
    const regionValues = region
      .map((cell) => cell.value)
      .filter((value) => value !== 0);

    const duplicateValues = regionValues.reduce((previous, current, idx) => {
      if (regionValues.indexOf(current) < idx) {
        previous.push(current);
      }
      return previous;
    }, []);

    let errors = false;
    region.forEach((cell) => {
      if (duplicateValues.includes(cell.value)) {
        errors = true;
        cell.duplicate = true;
      }
    });

    region.forEach((cell) => {
      if (errors) cell.error += 3.3;
    });
  };

  const checkErrors = ({ grid }) => {
    for (let i = 0; i < width * height; i++) {
      checkDuplicates(getRegion({ grid, regionRow: i }));
      checkDuplicates(getRegion({ grid, regionCol: i }));
    }

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        checkDuplicates(getRegion({ grid, regionRow: i, regionCol: j }));
      }
    }
  };

  const onSelect = ({ cell, rowIdx, colIdx }) => {
    if (!cell.locked) {
      setState((prevState) => ({
        ...prevState,
        selected: { row: rowIdx, column: colIdx },
      }));
    }
  };

  const selectorPressed = (selectedNumber) => {
    const { selected, grid } = state;

    if (selected !== null) {
      const updatedGrid = _.cloneDeep(grid);
      updatedGrid[selected.row][selected.column].value = selectedNumber;
      clearErrors(updatedGrid);
      checkErrors({ grid: updatedGrid });

      if (
        !countItems({ grid: updatedGrid, prop: 'value', value: 0 }) &&
        countItems({ grid: updatedGrid, prop: 'error', value: 0 }) ===
          Math.pow(width * height, 2)
      ) {
        onComplete();
      }

      setState((prevState) => ({ ...prevState, grid: updatedGrid }));
    }
  };

  const renderRow = ({ row, rowIdx }) => {
    return (
      <View key={rowIdx}>
        {row.map((cell, colIdx) =>
          renderCell({ cell, rowIdx, colIdx })
        )}
      </View>
    );
  };

  const renderCell = ({ cell, rowIdx, colIdx }) => {
    const { grid, selected } = state;
    const { cellStyle, cellText } = styles;

    const isSelected =
      selected?.row === rowIdx && selected?.column === colIdx;
    const style = [
      cellStyle,
      cell.error ? { backgroundColor: `rgba(255, 116, 102, ${cell.error / 10})` } : {},
      cell.duplicate ? { backgroundColor: 'rgb(255, 116, 102)' } : {},
      isSelected ? { backgroundColor: '#fff247' } : {},
    ];

    return (
      <TouchableOpacity
        style={style}
        onPress={() => onSelect({ cell, rowIdx, colIdx })}
        key={colIdx}
      >
        <Text style={cellText}>{cell.value || ''}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000}>
      <View style={styles.boardContainer}>
        {state.grid.map((row, rowIdx) => renderRow({ row, rowIdx }))}
      </View>
      <Animatable.View animation="lightSpeedIn" delay={1000}>
        <Selector onPress={selectorPressed} />
      </Animatable.View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
    boardContainer: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
      width: 40 * 9,
      height: 40 * 9,
      backgroundColor: '#121212', // Dark background for the container
    },
    cellStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: 39,
      height: 39,
      borderRadius: 1.5,
      borderWidth: 0.5,
      backgroundColor: '#333333', // Darker cell background
      borderColor: '#444444', // Darker border color
    },
    cellText: {
      fontSize: 30,
      color: '#ffffff', // Light text color for visibility
    },
  });
  
  export default Board;
  