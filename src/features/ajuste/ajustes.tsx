import React, { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 

import Dialog from 'react-native-dialog';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import SnackbarUI from '../../shared/ui/SnackbarUI';
import ButtonClickUI from '../../shared/ui/ButtonClickUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';

import * as lancamentoService from '../../core/persistence/service/lancamento-service';

const Ajustes = ( { navigation, route } : NativeStackScreenProps<StackParamsList, 'Ajustes'> ): React.JSX.Element => {

    const [resetarDialogVisivel, setResetarDialogVisivel] = useState<boolean>(false);
    const db = useSQLiteContext();

    const resetarOnPress = async () => {
        setResetarDialogVisivel( false );
        try {
          await lancamentoService.deletaTodosOsLancamentos( db );  
  
          SnackbarUI.showInfo( 'Lista de lançamentos resetada com sucesso.' );
        } catch ( error : any ) {
          SnackbarUI.showInfo( ''+error.message );
        }
    };

    return (
        <ScrollViewUI>            
            <TitleUI title='Ajustes' />
                
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