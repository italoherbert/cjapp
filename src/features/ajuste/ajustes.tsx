import React, { useState } from 'react';
import {
  Button,
  ScrollView,
  Text,
  View,
  Alert
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 

import Dialog from 'react-native-dialog';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import globalStyle from '../../shared/style/global-style';

import { persistence } from '../../core/persistence/persistence';
import SnackbarUI from '../../shared/ui/SnackbarUI';
import ButtonClickUI from '../../shared/ui/ButtonClickUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';

const Ajustes = ( { navigation, route } : NativeStackScreenProps<StackParamsList, 'Ajustes'> ): React.JSX.Element => {

    const [resetarDialogVisivel, setResetarDialogVisivel] = useState<boolean>(false);

    const resetarOnPress = async () => {
        setResetarDialogVisivel( false );
        try {
          await persistence.lancamentoService.deletaTodosOsLancamentos();  
  
          SnackbarUI.showInfo( 'Lista de lançamentos resetada com sucesso.' );
        } catch ( error : any ) {
          SnackbarUI.showInfo( ''+error.message );
        }
    };

    return (
        <ScrollViewUI>
            
            <View style={globalStyle.titlePanel}>
                <Text style={globalStyle.title}>
                    Ajustes
                </Text>
            </View>
    
            <ButtonClickUI
                label="Resetar lançamentos"                         
                onPress={() => setResetarDialogVisivel( !resetarDialogVisivel )} 
            />                                             
            
            <Dialog.Container visible={resetarDialogVisivel}>
                <Dialog.Title>Exclusão de lançamentos</Dialog.Title>
                <Dialog.Description>
                    Tem certeza que deseja excluir a lista de lançamentos?
                </Dialog.Description>
                <Dialog.Button label="Excluir" onPress={resetarOnPress} />
                <Dialog.Button label="Cancelar" onPress={() => setResetarDialogVisivel( false )} />                  
            </Dialog.Container>
        </ScrollViewUI>
    )
};

export default Ajustes;