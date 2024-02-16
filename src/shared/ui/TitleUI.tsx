
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
};

function TitleUI ( { title, marginTop, marginBottom } : TitleProps ): React.JSX.Element {
    return (
        <View style={[styles.view, {                
                marginTop: marginTop, 
                marginBottom: marginBottom }]}>
            <Text style={styles.text}>
                {title}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        marginVertical: 15
    },
    text: {
        fontSize: 24,
        textAlign: 'center'
    },
});

export default TitleUI;