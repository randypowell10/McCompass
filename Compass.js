import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Arrow from './assets/arrow.svg';
import McArrow from './assets/McArrow.svg';

export const Compass = (props) => {
    const {heading} = props;
  return (
    // <View style={[styles.container, {
    //     transform: [{ rotate: `${Math.round(heading)}deg` }]
    //   }]}>
    <View style={styles.container}>
        <View height={500} width={500}>
            <McArrow height={500} width={500} style={{transform: [{ rotate: `${Math.round(heading)}deg` }], tintColor:'orange' }}/>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
