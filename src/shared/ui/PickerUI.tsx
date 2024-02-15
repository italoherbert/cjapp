import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";

export type PickerItem = {
    label : string,
    value : any
}

type DatePickerProps = React.PropsWithChildren<{
    selectedValue : any,
    setValue : Function,
    itens? : PickerItem[]; 
}>;

type DataPickerItemProps = {
    label : string,
    value : any,
    key? : any
};

function PickerUI ( { children, selectedValue, setValue } : DatePickerProps ) : React.JSX.Element {
    
    return (
        <Picker
            selectedValue={selectedValue}                
            onValueChange={ (itemValue, itemIndex) => setValue( itemValue, itemIndex) }>
                {children}                     
        </Picker>
    );
}

function Item ( { label, value, key } : DataPickerItemProps ) : React.JSX.Element {
    return (
        <Picker.Item key={key}
            color={styles.pickerItem.color}
            label={label} 
            value={value} />
    );
}

const styles = StyleSheet.create( {
    pickerItem : {
        color: '#AAA'
    }
} );

PickerUI.Item = Item;
export default PickerUI;