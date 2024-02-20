import React, { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 

import Dialog from 'react-native-dialog';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import SnackbarUI from '../../shared/ui/SnackbarUI';
import ButtonClickUI from '../../shared/ui/ButtonClickUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';

import * as ajustesService from '../../core/persistence/service/ajustes-service';
import * as lancamentosGrupoService from '../../core/persistence/service/lancamentos-grupo-service';

import { handleError } from '../../shared/error/error-handler';
import ViewUI from '../../shared/ui/ViewUI';
import { Alert } from 'react-native';

const Ajustes = ( { navigation, route } : NativeStackScreenProps<StackParamsList, 'Ajustes'> ): React.JSX.Element => {

    const [resetarDialogVisivel, setResetarDialogVisivel] = useState<boolean>(false);
    const db = useSQLiteContext();

    const resetarOnPress = async () => {
        setResetarDialogVisivel( false );
        try {
            await lancamentosGrupoService.deletaTodosOsGrupos( db );  
  
            SnackbarUI.showInfo( 'Lista de lançamentos resetada com sucesso.' );
        } catch ( error ) {
          handleError( error );
        }
    };

    const ajustarDBOnPress = async () => {
        try {
            await ajustesService.ajustarDB( db );

            SnackbarUI.showInfo( 'Ajuste realizado com sucesso.' );
        } catch ( error ) {
            handleError( error );
        }
    };
    
    return (
        <ScrollViewUI>            
            <TitleUI title='Ajustes' />
                            
            <ViewUI marginVertical={10}>
                <ButtonClickUI
                    label="Ajustar banco de dados"                         
                    onPress={ ajustarDBOnPress } 
                /> 
            </ViewUI>
                                                        
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