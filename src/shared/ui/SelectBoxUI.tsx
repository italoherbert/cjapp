
import React, { useEffect, useState } from "react";
import { 
    View,
    Button,
    Text, 
    StyleSheet,
    Pressable,
    Alert
} from "react-native";

export type SelectBoxUIProps = {
    op1OnSelect : Function,
    op2OnSelect : Function,
    op1Rotulo : string,
    op2Rotulo : string,
    defaultOpSelectedIndex? : number
};

function SelectBoxUI( { op1OnSelect, op2OnSelect, op1Rotulo, op2Rotulo, defaultOpSelectedIndex } : SelectBoxUIProps ): React.JSX.Element {

    const [ op1Selected, setOp1Selected ] = useState<boolean>( true );
    const [ op2Selected, setOp2Selected ] = useState<boolean>( false );

    const op1OnPress = () => {
        setOp1Selected( true );
        setOp2Selected( false );
        op1OnSelect();
    };

    const op2OnPress = () => {
        setOp1Selected( false );
        setOp2Selected( true );
        op2OnSelect();
    };

    useEffect( () => {
        if ( defaultOpSelectedIndex == 2 ) {            
            setOp1Selected( false );
            setOp2Selected( true );
        } else {
            setOp1Selected( true );
            setOp2Selected( false );
        }
    }, [] );

    return (
        <View style={styles.view}>
            <Pressable onPress={ op1OnPress }>
                <Text style={[styles.text, op1Selected ? styles.selected : styles.notSelected]}>{op1Rotulo}</Text>
            </Pressable>
            <Pressable onPress={ op2OnPress }>
                <Text style={[styles.text, op2Selected ? styles.selected : styles.notSelected]}>{op2Rotulo}</Text>
            </Pressable>            
        </View>
    );

}

const styles = StyleSheet.create({
    view : {
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'center', 
    },    
    text : {
        fontStyle: 'normal',
        fontWeight: "bold",         
        paddingHorizontal: 15,
        paddingVertical: 6
    },
    selected : {
        backgroundColor: '#08F',
        color: '#FFF'
    },
    notSelected : {
        fontStyle: 'normal',
        fontWeight: "bold", 
        backgroundColor: '#8AF',
        color: '#FFF'
    }
    
});

export default SelectBoxUI;