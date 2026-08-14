import React from "react";

import {
Button
} from "react-native";


interface Props{

onPress:()=>void;

}


export default function DisconnectButton({
onPress
}:Props){


return (

<Button

title="Disconnect"

color="red"

onPress={onPress}

/>

);

}