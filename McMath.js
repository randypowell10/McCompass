import mcDicks from './data/mcDicks.json';

// Convert x/y magnometer to angle
export const _angle = (magnetometer) => {
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
    return angle;
};
//convert x/y to angle
export const getAngle = (x,y) => {
    return Math.atan2(y, x) * 180 / Math.PI;
}
// Converts from degrees to radians.
export const toRadians = (degrees) => {
    return degrees * Math.PI / 180;
};
// Converts from radians to degrees.
export const toDegrees = (radians) => {
    return radians * 180 / Math.PI;
}
// Angle bearing between 2 points
export const bearing = (startLat, startLng, destLat, destLng) => {
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);
  
    y = Math.sin(destLng - startLng) * Math.cos(destLat);
    x = Math.cos(startLat) * Math.sin(destLat) -
          Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    // brng -= 90;
    // brng *=-1;
    return (brng + 360) % 360;
}
// Get closest mcdonald's given a location (x,y)
export const getNearest = (loc) => {
    let closest = getClosest(mcDicks.data,loc,(d)=>d.lat,(d)=>d.lon);
    return closest;
}
// Distance between 2 points
export const distance = (p1,p2) => {
    return ((p2.x-p1.x)**2 + (p2.y-p1.y)**2)**0.5
}
// Closest point in a dataset to a location
export const getClosest = (data, loc, xAccessor, yAccessor,threshold=Infinity) => {
    let min = null;
    let minObj = null;
    data.forEach((point,i)=>{
      let dist = distance({x:xAccessor(point), y:yAccessor(point)},loc);
      if((!min||dist<min)&&!isNaN(dist)){
          min=dist;
          minObj=point;
      }
    })
    return min<=threshold?minObj:null;
}
// Subtract 2 angles (return -180 to 180)
export const subtractAngle = (ang1, ang2) => {
    let a = ang1 - ang2;
    if (a > 180) a -= 360;
    if (a < -180) a += 360;
    return a;
}