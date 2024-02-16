
import React, { useEffect, useState } from 'react';

import {
    StyleSheet,
    Text,
} from 'react-native';

import * as Types from './types/types';

export type SimpleFieldProps = React.PropsWithChildren<{
    marginHorizontal? : number,
    marginVertical? : number,
    padding?: number,
    variant?: Types.Color,
    size?: string
}>;

function TextUI ( 
            { children, marginHorizontal, marginVertical, padding, variant, size } : SimpleFieldProps ): React.JSX.Element {

    const [ textColor, setTextColor ] = useState<string | undefined>(undefined);
    const [ fontSize, setFontSize ] = useState<number | undefined>(undefined);

    useEffect( () => {
        setTextColor( Types.getColor( variant! ) );
        setFontSize( Types.getFontSize( size! ) );        
    }, [variant, size] );

    return (
        <Text style={[styles.text, {
                color: textColor, 
                fontSize: fontSize,
                marginHorizontal: marginHorizontal,
                marginVertical: marginVertical,
                padding: padding }]}>
            {children?.toString()} 
        </Text>            
    )
}

const styles = StyleSheet.create({
    text : {
        fontSize: 14,
        fontWeight: 'normal'
    }
});

export default TextUI;