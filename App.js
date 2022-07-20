import { StatusBar } from 'expo-status-bar';
import React, {useState,useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Magnetometer } from 'expo-sensors';

import * as Location from 'expo-location';

import mcDicks from './data/mcDicks.json';

const _angle = (magnetometer) => {
  let angle = 0;
  if (magnetometer) {
    let { x, y, z } = magnetometer;
    if (Math.atan2(y, x) >= 0) {
      angle = Math.atan2(y, x) * (180 / Math.PI);
    } else {
      angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
    }
  }
  // return Math.round(angle - 90 >= 0 ? angle - 90 : angle + 271);
  return Math.round(angle);
};
const getAngle = (x,y) => {
  return Math.atan2(y, x) * 180 / Math.PI;
}
// Converts from degrees to radians.
function toRadians(degrees) {
  return degrees * Math.PI / 180;
};
// Converts from radians to degrees.
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}
function bearing(startLat, startLng, destLat, destLng){
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(destLat);
  destLng = toRadians(destLng);

  y = Math.sin(destLng - startLng) * Math.cos(destLat);
  x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}

const getNearest = (loc) => {
  let closest = getClosest(mcDicks.data,loc,(d)=>d.lat,(d)=>d.lon);
  return closest;
}
export const distance = (p1,p2) => {
  return ((p2.x-p1.x)**2 + (p2.y-p1.y)**2)**0.5
}
export const getClosest = (data, loc, xAccessor, yAccessor,threshold=Infinity) => {
  let min = null;
  let minObj = null;
  data.forEach((point,i)=>{
    let dist = distance({x:xAccessor(point), y:yAccessor(point)},loc);
    if((!min||dist<min)&&!isNaN(dist)){
        min=dist;
        minObj=point;
    }
    // if(i<10) console.log(xAccessor(point), yAccessor(point),dist);
  })
  return min<=threshold?minObj:null;
}



const getFinalAngle = (ang1, ang2) => {
  // console.log(ang1, ang2)
  let a = ang1 - ang2;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
  // return 90;
}

export default function App() {
  const [location, setLocation] = useState(null);

  const [subscription, setSubscription] = useState(null);
  const [triggerGPS,setTriggerGPS] = useState(false);

  const [currentHeading, setCurrentHeading] = useState(null);
  const [finalHeading, setFinalHeading] = useState(null);

  useEffect(()=>{
      if(location&&currentHeading){
        const nearest = getNearest({x:location.coords.latitude, y:location.coords.longitude});
        const heading = bearing(location.coords.latitude, location.coords.longitude, nearest.lat, nearest.lon);

        // setClosest(nearest);
        // setWantedHeading(heading);  
        setFinalHeading(getFinalAngle(currentHeading,heading));

      }
  },[location,currentHeading])

  useEffect(() => {
    setTimeout(()=>setTriggerGPS(v=>!v),1000)
    getGPS();
  }, [triggerGPS]);

  const getGPS = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});      
      setLocation(location);
  }

  const _slow = () => {
    Magnetometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Magnetometer.setUpdateInterval(16);
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener(result => {
        setCurrentHeading(_angle(result))
        // console.log(result)
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text>
        {currentHeading}
      </Text>
      {/* <Text>
        {finalHeading}
      </Text> */}
      
      <StatusBar style="auto" />
    </View>
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
