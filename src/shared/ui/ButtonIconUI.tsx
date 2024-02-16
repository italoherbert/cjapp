
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';

import { 
    View,
    Text, 
    Pressable,
    StyleSheet
} from 'react-native';

import * as Types from './types/types';

export type ButtonProps = {
    icon: any,
    label : string,
    onPress : Function,
    flex? : number,
    variant?: Types.Color,
    marginType? : Types.MarginType,
    disable? : boolean;
}

const MARGIN_HORIZONTAL = 5;
const DEFAULT_COLOR = '#08F';
const DISABLED_COLOR = '#999';

const BG_COLOR = "#EEF";
const DISABLED_BG_COLOR = "#CCC";

const DEFAULT_TEXTCOLOR = '#666';

function ButtonIconUI ( { 
        label,
        icon, 
        variant, 
        disable, 
        flex, 
        marginType,
        onPress } : ButtonProps ): React.JSX.Element {

    const [iconColor, setIconColor] = useState<string|undefined>(undefined); 
    const [marginLeft, setMarginLeft] = useState<number|undefined>(undefined);
    const [marginRight, setMarginRight] = useState<number|undefined>(undefined);
    const [borderColor, setBorderColor] = useState<string|undefined>(undefined);
    const [textColor, setTextColor] = useState<string|undefined>(undefined);
    const [backgroundColor, setBackgroundColor] = useState<string|undefined>(undefined);

    const btnOnPress = async () => {
        if ( !disable )
            onPress();
    };

    useEffect( () => {
        let color;
        if ( variant ) {
            color = Types.getColor( variant! )
        } else {
            color = DEFAULT_COLOR;
        }       

        setBackgroundColor( disable === true ? DISABLED_BG_COLOR : BG_COLOR );

        setIconColor( disable === true ? DISABLED_COLOR : color );
        setBorderColor( disable === true ? DISABLED_COLOR : color );

        setTextColor( disable === true ? DISABLED_COLOR : DEFAULT_TEXTCOLOR );

        if ( marginType === 'left' || marginType === 'both' )
            setMarginLeft( MARGIN_HORIZONTAL );        
        if ( marginType === 'right' || marginType === 'both' )
            setMarginRight( MARGIN_HORIZONTAL );                
    }, [variant, marginType, disable] );    

    return (
        <Pressable onPress={() => btnOnPress()} style={[
                    styles.pressable, 
                    { 
                        flex: flex, 
                        marginLeft:marginLeft, 
                        marginRight: marginRight, 
                        backgroundColor: backgroundColor,
                        borderColor: borderColor
                    },
                ]}>
            <View style={[styles.view]}>
                <View style={{alignItems: 'center'}}>
                    
                    <FontAwesomeIcon icon={icon} 
                        size={styles.icon.fontSize} 
                        color={iconColor} />

                    <Text style={[styles.text, {color: textColor}]}>
                        {label}
                    </Text>
                    
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({  
    pressable: {
        borderWidth: 1,
        borderRadius: 6,
    },
    view: {       
        flexDirection: 'column',        
        padding: 5,         
    },

    icon: {
        fontSize: 26
    },

    text: {
        fontSize: 14,
        fontWeight: 'normal'
    },
});

export default ButtonIconUI;