import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Arrow from './assets/arrow.svg';

export const Compass = (props) => {
    const {heading} = props;
  return (
    // <View style={[styles.container, {
    //     transform: [{ rotate: `${Math.round(heading)}deg` }]
    //   }]}>
    <View style={styles.container}>
        <View height={300} width={300}>
            <Arrow height={300} width={300} style={{transform: [{ rotate: `${Math.round(heading)}deg` }], tintColor:'lightblue' }}/>
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
