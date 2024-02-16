import { Picker } from "@react-native-picker/picker";

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
            label={label} 
            value={value} />
    );
}

PickerUI.Item = Item;
export default PickerUI;