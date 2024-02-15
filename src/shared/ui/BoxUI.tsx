import React, { useEffect, useState } from 'react';

import { StyleSheet, View } from "react-native";

import * as UIUtil from './util/ui-util';

export type BoxProps = React.PropsWithChildren<{
    flex?: number,
    justifyContent?: any,
    alignItems?: any,
    marginVertical?: number,
    marginHorizontal?: number,
    marginTop?: number,
    marginBottom? : number,
    paddingHorizontal?: number,
    paddingVertical?: number,
    padding?: number,
    margin?: number,
    isRow?: boolean,
    background?: string
}>

function BoxUI ( { children, 
        flex, isRow, 
        marginVertical,
        marginHorizontal,
        marginTop,
        marginBottom,
        margin,
        paddingHorizontal,
        paddingVertical,
        padding,
        justifyContent,
        alignItems,
        background } : BoxProps ) : React.JSX.Element {

    const [ backgroundColor, setBackgroundColor ] = useState<string | undefined>(undefined);

    useEffect( () => {
        setBackgroundColor( UIUtil.getColor( background! ) );        
    }, [background] );

    return (
        <View style={{ 
                flexDirection: ( isRow === true ? 'row' : 'column' ), 
                flex: flex, 
                justifyContent: justifyContent,
                alignItems: alignItems,
                marginVertical: marginVertical,
                marginHorizontal: marginHorizontal,
                marginTop: marginTop,
                marginBottom: marginBottom,
                margin: margin,
                paddingHorizontal: paddingHorizontal,
                paddingVertical: paddingVertical,
                padding: padding,
                backgroundColor: backgroundColor }}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    
});

export default BoxUI;