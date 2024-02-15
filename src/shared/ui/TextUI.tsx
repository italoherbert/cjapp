
import React, { useEffect, useState } from 'react';

import {
    StyleSheet,
    Text,
} from 'react-native';

import * as UIUtil from './util/ui-util';

export type SimpleFieldProps = React.PropsWithChildren<{
    marginHorizontal? : number,
    padding?: number,
    variant?: string,
    size?: string
}>;

function TextUI ( 
            { children, marginHorizontal, padding, variant, size } : SimpleFieldProps ): React.JSX.Element {

    const [ textColor, setTextColor ] = useState<string | undefined>(undefined);
    const [ fontSize, setFontSize ] = useState<number | undefined>(undefined);

    useEffect( () => {
        setTextColor( UIUtil.getColor( variant! ) );
        setFontSize( UIUtil.getFontSize( size! ) );        
    }, [variant, size] );

    return (
        <Text style={[styles.text, {
                color: textColor, 
                fontSize: fontSize,
                marginHorizontal: marginHorizontal,
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