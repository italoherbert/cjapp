import React, { useEffect, useState } from 'react';

import { StyleSheet, View } from "react-native";

import * as UIUtil from './types/types';

export type ViewProps = React.PropsWithChildren<{
    flex?: number,
    justifyContent?: any,
    alignItems?: any,
    marginVertical?: number,
    marginHorizontal?: number,
    marginTop?: number,
    marginBottom?: number,
    marginLeft?: number,
    marginRight?: number,
    paddingHorizontal?: number,
    paddingVertical?: number,
    padding?: number,
    margin?: number,
    isRow?: boolean,
    background?: UIUtil.Color,
    border?: UIUtil.Color
}>

function ViewUI ( { children, 
        flex, isRow, 
        marginVertical,
        marginHorizontal,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        margin,
        paddingHorizontal,
        paddingVertical,
        padding,
        justifyContent,
        alignItems,
        background,
        border } : ViewProps ) : React.JSX.Element {

    const [ backgroundColor, setBackgroundColor ] = useState<string | undefined>(undefined);
    const [ borderWidth, setBorderWidth ] = useState<number | undefined>(undefined);
    const [ borderColor, setBorderColor ] = useState<string | undefined>(undefined);

    useEffect( () => {
        setBackgroundColor( UIUtil.getColor( background! ) );        
        setBorderWidth( border ? 1 : undefined );
        setBorderColor( border ? UIUtil.getColor( border ) : undefined );
    }, [background, border] );

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
                marginLeft: marginLeft,
                marginRight: marginRight,
                margin: margin,
                paddingHorizontal: paddingHorizontal,
                paddingVertical: paddingVertical,
                padding: padding,
                backgroundColor: backgroundColor,
                borderWidth: borderWidth,
                borderColor: borderColor }}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    
});

export default ViewUI;