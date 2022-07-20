import { StatusBar } from 'expo-status-bar';
import React, {useState,useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Location from 'expo-location';

import { _angle, bearing, getNearest, subtractAngle } from './McMath';
import { Compass } from './Compass';
const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
const HEADING_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

export default function App() {
  const [location, setLocation] = useState(null);
  const [currentHeading, setCurrentHeading] = useState(null);
  const [finalHeading, setFinalHeading] = useState(null);

  useEffect(()=>{
      if(location&&currentHeading){
        const nearest = getNearest({x:location.coords.latitude, y:location.coords.longitude});
        // console.log(nearest)
        const heading = bearing(location.coords.latitude, location.coords.longitude, nearest.lat, nearest.lon);
        setFinalHeading(subtractAngle(heading,currentHeading));
      }
  },[location,currentHeading])
  useEffect(()=>{
    Location.watchPositionAsync(GEOLOCATION_OPTIONS,(res)=>{
      setLocation(res);
    });
    Location.watchHeadingAsync((res)=>{
      setCurrentHeading(res.trueHeading)
    },HEADING_OPTIONS);
  },[])

  return (
    <Compass heading={finalHeading}/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
