import React from 'react';

import { 
    StyleSheet,
    TextInput 
} from "react-native";

export type TextInputProps = {
    placeholder? : string,
    defaultValue : string,
    setValue : Function,
};

function TextInputUI( { placeholder, defaultValue, setValue } : TextInputProps ) : React.JSX.Element {
    return (
        <TextInput 
            style={styles.textInput}
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

        borderBottomWidth: 1,
        borderColor: '#CCF',
        color: '#666'
    },

    placeholder : {
        color: '#669'
    }
});

export default TextInputUI;