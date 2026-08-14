import React from "react";
import {
 Button
} from "react-native";


interface Props{
  scanning:boolean;
  onPress:()=>void;
}


export default function ScanButton({
  scanning,
  onPress
}:Props){


return (

<Button

title={
 scanning
 ? "Scanning..."
 : "Scan Devices"
}

disabled={scanning}

onPress={onPress}

/>

);

}