import { Text, View } from "react-native";

import Dialog from 'react-native-dialog';

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleExclamation, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { PropsWithChildren, useEffect, useState } from "react";
import ViewUI from "./ViewUI";

export type MessageType = "info" | "error";

export type MessageUIProps = PropsWithChildren<{    
    visible : boolean,
    setVisible : Function,
    type? : MessageType;
}>;

function MessageUI( { children, type, visible, setVisible } : MessageUIProps ) :React.JSX.Element {    

    return (
        <Dialog.Container visible={ visible }>
            <Dialog.Description>
                <View style={{   
                        flexWrap: 'wrap',                         
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'}}>                                            
                   
                    <FontAwesomeIcon 
                        icon={type === 'info' ? faCircleInfo : faCircleExclamation} 
                        color={type === 'info' ? 'green' : 'red' }
                        size={42}
                    />

                    <Text style={{  
                            width: 250,                             
                            marginHorizontal: 10, 
                            color: type === 'info' ? 'green' : 'red' }}>
                        {children?.toString()}
                    </Text>
                </View>                
            </Dialog.Description>            
            <View style={{justifyContent:"center"}}>
                <Dialog.Button label="Fechar" onPress={() => setVisible( false )} />                  
            </View>
        </Dialog.Container>                        
    );
}

export default MessageUI;