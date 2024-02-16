import React, { useState } from 'react';

import { 
    Text,
    StyleSheet,
    Pressable
} from "react-native";

export type ActionButtonProps = {
    label : string,
    onPress : Function
};

function ButtonClickUI ( { label, onPress } : ActionButtonProps) : React.JSX.Element {

    const [pressed, setPressed] = useState<boolean>(false);

    return (
        <Pressable style={[
                    styles.view, 
                    (pressed === true ? styles.pressedView : styles.normalView )
                ]}
                onPress={() => {onPress()}}
                onPressIn={() => setPressed( true )}
                onPressOut={() => setPressed( false )}>
            <Text style={[
                    styles.text, 
                    (pressed === true ? styles.pressedText : styles.normalText )                    
                ]}>
                    {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create( {  
    view: {        
        padding: 15,
        borderRadius: 6,
    },    
    text: {        
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    normalView: {
        backgroundColor: '#66D',
    },
    pressedView: {
        backgroundColor: '#AAD',
    },

    normalText: {
        color: '#FFF'
    },
    pressedText: {
        color: '#FFF'
    }

} );

export default ButtonClickUI;