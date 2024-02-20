import { StyleSheet, View } from "react-native";

import * as Types from './types/types';
import { useEffect, useState } from "react";

export type LineProps = {
    variant: Types.Color
}

function LineUI( { variant } : LineProps ) : React.JSX.Element {

    const [color, setColor] = useState<string>('#000');

    const carrega = async () => {
        let cor = Types.getColor( variant );
        setColor( cor! );
    }

    useEffect( () => {
        carrega();
    }, [variant] );

    return (
        <View style={{
                borderBottomWidth: 1,
                borderBottomColor: color }}>            
        </View>
    );
}

const styles = StyleSheet.create({
    line: {
        borderBottomWidth: 1,
    }
});

export default LineUI;