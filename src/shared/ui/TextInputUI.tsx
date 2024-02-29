import React, { useEffect, useState } from 'react';

import { 
    StyleSheet,
    TextInput 
} from "react-native";

import * as Types from './types/types';

export type TextInputProps = {
    placeholder? : string,
    defaultValue : string,
    setValue : Function,
    size?: Types.Size
};

function TextInputUI( { placeholder, defaultValue, setValue, size } : TextInputProps ) : React.JSX.Element {

    const [fontSize, setFontSize] = useState<number|undefined>(undefined);

    useEffect( () => {
        setFontSize( Types.getFontSize( size! ) );
    }, [size] );

    return (
        <TextInput 
            style={[styles.textInput, {
                fontSize: fontSize
            }]}
            placeholderTextColor={styles.placeholder.color}
            defaultValue={defaultValue}
            onChangeText={(text) => setValue( text )}
            placeholder={placeholder}  
        />
    );
}

const styles = StyleSheet.create({
    textInput : {
        marginVertical: 5,
        marginHorizontal: 0,

        paddingHorizontal: 15,

        borderBottomWidth: 1,
        borderColor: '#CCF',
        color: '#333'
    },

    placeholder : {
        color: '#666'
    }
});

export default TextInputUI;