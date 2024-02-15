
import React, { useEffect, useState } from "react";
import { 
    View,
    Button,
    Text, 
    StyleSheet,
    Pressable,
    Alert
} from "react-native";

import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import * as formatter from '../../core/converter/converter';

export type DateUIProps = {
    date : Date,
    setDate : Function,
    rotulo : string
};

function DateUI( {date, setDate, rotulo} : DateUIProps ): React.JSX.Element {

    const [visible, setVisible] = useState<boolean>(false);

    return (
        <View>
            <Pressable onPress={() => setVisible( true )}>
                <View style={[styles.dateInput]}>
                    <Text style={styles.text}>{formatter.formatDate( date )}</Text>
                    <Text style={styles.text}>{rotulo}</Text>                                            
                </View>
            </Pressable>

            { visible === true &&
                <DateTimePicker
                    mode="date"
                    value={date} 
                    onChange={(event : DateTimePickerEvent, date2? : Date) => {               
                        setVisible( false );  
                        setDate( date2 );  
                    }}                
                />                   
            }

        </View>
    );

}

const styles = StyleSheet.create({    
    dateInput : {
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
  
        borderBottomColor: '#CCF',
        borderBottomWidth: 1,
          
        marginVertical: 10,

        paddingVertical: 16,
        paddingHorizontal: 5
      },

      text : {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666'
      }

});

export default DateUI;