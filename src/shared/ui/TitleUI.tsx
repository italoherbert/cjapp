
import React from 'react';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export type TitleProps = {
    title : string,
    marginTop? : number,
    marginBottom?: number,
    textAlign? : any
};

function TitleUI ( { title, textAlign, marginTop, marginBottom } : TitleProps ): React.JSX.Element {
    return (
        <View style={[styles.view, {                
                marginTop: marginTop, 
                marginBottom: marginBottom }]}>
            <Text style={[styles.text, { textAlign: textAlign }]}>
                {title}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        marginBottom: 5
    },
    text: {
        fontSize: 24
    },
});

export default TitleUI;