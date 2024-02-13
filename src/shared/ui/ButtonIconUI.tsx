
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';

import { 
    View,
    Text, 
    Pressable,
    StyleSheet
} from 'react-native';
import globalStyle from '../style/global-style';

export type ButtonProps = {
    icon: any,
    label : string,
    textStyle? : any,
    flex? : number,
    onPress : Function,
    marginType? : string
}

function ButtonIconUI ( { icon, label, textStyle, flex, onPress, marginType } : ButtonProps ): React.JSX.Element {

    return (
        <Pressable onPress={() => onPress()} style={[
                    styles.pressable, 
                    {marginLeft: marginType === 'left' || marginType === 'both' ? 5 : 0 },
                    {marginRight: marginType === 'right' || marginType === 'both' ? 5 : 0 },
                    {flex: flex}
                ]}>
            <View style={[styles.view]}>
                <View style={{alignItems: 'center'}}>
                    
                    <FontAwesomeIcon icon={icon} 
                        size={styles.icon.fontSize} 
                        color={styles.icon.color} />

                    <Text style={[styles.text, textStyle]}>
                        {label}
                    </Text>
                    
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({  
    pressable: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#CCF',
        backgroundColor: '#EEF'
    },
    view: {       
        flexDirection: 'column',        
        padding: 5,         
    },

    icon: {
        color: '#08F',
        fontSize: 26
    },

    text: {
        fontSize: 14,
        fontWeight: 'normal'
    }
});

export default ButtonIconUI;