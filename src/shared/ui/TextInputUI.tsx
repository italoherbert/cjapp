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