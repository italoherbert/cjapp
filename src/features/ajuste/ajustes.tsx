import React, { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 

import Dialog from 'react-native-dialog';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import SnackbarUI from '../../shared/ui/SnackbarUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';
import TextUI from '../../shared/ui/TextUI';
import ButtonClickUI from '../../shared/ui/ButtonClickUI';

import * as ajustesService from '../../core/persistence/service/ajustes-service';
import * as lancamentosGrupoService from '../../core/persistence/service/lancamentos-grupo-service';

import { handleError } from '../../shared/error/error-handler';

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
                            
            <TextUI variant='primary'>Nenhum ajuste necessário</TextUI>                                                                   
        </ScrollViewUI>
    )
};

export default Ajustes;