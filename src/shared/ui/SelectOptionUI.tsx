import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";

export type PickerItem = {
    label : string,
    value : any
}

export type DatePickerProps = {
    selectedValue : any,
    setValue : Function,
    itens? : PickerItem[];
}

function SelectOptionUI ( { selectedValue, setValue, itens } : DatePickerProps ) : React.JSX.Element {
    return (
        <Picker
            selectedValue={selectedValue}                
            onValueChange={ (itemValue, itemIndex) => setValue( itemValue, itemIndex) }>
                { itens!.map( (item, index) => 
                    <Picker.Item key={index}
                        color={styles.pickerItem.color}
                        label={item.label} 
                        value={item.value} />
                )}            
        </Picker>
    );
}

const styles = StyleSheet.create( {
    pickerItem : {
        color: '#666'
    }
} );

export default SelectOptionUI;