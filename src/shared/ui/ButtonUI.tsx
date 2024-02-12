
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';

import { 
    View,
    Text, 
    Pressable,
    StyleSheet
} from 'react-native';

export type ButtonProps = {
    color: string,
    icon: any,
    size : number,
    label : string,
    textStyle? : any,
    style? : any,
    onPress : Function,
    marginType? : string
}

function ButtonUI ( { color, icon, size, label, textStyle, style, onPress, marginType } : ButtonProps ): React.JSX.Element {

    return (
        <Pressable onPress={() => onPress()} style={[
                    style, styles.pressable,
                    {marginLeft: marginType === 'left' || marginType === 'both' ? 5 : 0 },
                    {marginRight: marginType === 'right' || marginType === 'both' ? 5 : 0 }
                ]}>
            <View style={[styles.view, {borderColor: color}]}>
                <View style={{alignItems: 'center'}}>
                    <FontAwesomeIcon icon={icon} size={size+12} color={color} />
                    <Text style={[textStyle, {fontSize: size, fontWeight: 'normal'}]}>{label}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({  
    pressable: {
        borderWidth: 1,
        borderColor: '#CCF',
        borderRadius: 6,
        backgroundColor: '#EEF'
    },
    view: {       
        flexDirection: 'column',        
        padding: 5,        
    }
});

export default ButtonUI;