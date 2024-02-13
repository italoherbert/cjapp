import React, { useState } from 'react';

import { 
    Text,
    StyleSheet,
    Pressable
} from "react-native";

export type ActionButtonProps = {
    label : string,
    style? : any,
    textStyle? : any,
    onPress : Function
};

function ButtonClickUI ( { label, style, textStyle, onPress } : ActionButtonProps) : React.JSX.Element {

    const [pressed, setPressed] = useState<boolean>(false);

    return (
        <Pressable style={[
                    styles.view, 
                    (pressed === true ? styles.pressedView : styles.normalView ), 
                    style
                ]}
                onPress={() => {onPress()}}
                onPressIn={() => setPressed( true )}
                onPressOut={() => setPressed( false )}>
            <Text style={[
                    styles.text, 
                    (pressed === true ? styles.pressedText : styles.normalText ),
                    textStyle
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
        borderWidth: 1,        
        borderColor: '#33A',
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