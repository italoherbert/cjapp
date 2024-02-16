import React, { useEffect, useState } from 'react';

import { View } from "react-native";

import * as Types from './types/types';

export type BoxFieldProps = React.PropsWithChildren<{
    flex?: number,
    justifyContent?: any,
    alignItems?: any,
    marginVertical?: number
    isRow?: boolean,
    background?: Types.Color,
    padding?: number    
}>

function BoxFieldUI ( { children, flex, isRow, 
        justifyContent, alignItems,  marginVertical, padding, background } : BoxFieldProps ) : React.JSX.Element {

    const [ backgroundColor, setBackgroundColor ] = useState<string | undefined>(undefined);

    useEffect( () => {
        setBackgroundColor( Types.getColor( background! ) );
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

export default BoxFieldUI;