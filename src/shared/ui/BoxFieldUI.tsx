import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';

import { StyleSheet, View } from "react-native";

import * as UIUtil from './util/ui-util';

export type BoxFieldProps = React.PropsWithChildren<{
    flex?: number,
    justifyContent?: any,
    alignItems?: any,
    marginVertical?: number
    isRow?: boolean,
    background?: string,
    padding?: number    
}>

function BoxFieldUI ( { children, flex, isRow, 
        justifyContent, alignItems,  marginVertical, padding, background } : BoxFieldProps ) : React.JSX.Element {

    const [ backgroundColor, setBackgroundColor ] = useState<string | undefined>(undefined);

    useEffect( () => {
        setBackgroundColor( UIUtil.getColor( background! ) );
    }, [background] );

    return (
        <View style={{ 
                justifyContent: justifyContent,
                alignItems: alignItems,
                flexDirection: ( isRow === true ? 'row' : 'column' ), 
                flex: flex, 
                padding: padding,
                marginVertical: marginVertical,
                backgroundColor: backgroundColor }}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    
});

export default BoxFieldUI;