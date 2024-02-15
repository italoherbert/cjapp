
import React, { Children } from 'react';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export type SimpleFieldProps = React.PropsWithChildren<{
    
}>;

function SimpleFieldUI ( { children } : SimpleFieldProps ): React.JSX.Element {
    return (
        <View style={[styles.field]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    field: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,      
    }  
});

export default SimpleFieldUI;