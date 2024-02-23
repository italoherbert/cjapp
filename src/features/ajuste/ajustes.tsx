import React, { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 

import { StackParamsList } from '../../shared/screens/StackParamsList';

import SnackbarUI from '../../shared/ui/SnackbarUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';
import TextUI from '../../shared/ui/TextUI';

import * as ajustesService from '../../core/persistence/service/ajustes-service';

import { handleError } from '../../shared/error/error-handler';
import ButtonClickUI from '../../shared/ui/ButtonClickUI';

const Ajustes = ( { navigation, route } : NativeStackScreenProps<StackParamsList, 'Ajustes'> ): React.JSX.Element => {

    const [ajusteNecessario, setAjusteNecessario] = useState<boolean>(false);
    const db = useSQLiteContext();

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

            { ajusteNecessario === false && 
                <TextUI variant='primary'>Nenhum ajuste necessário</TextUI>                                                                   
            }                 
            { ajusteNecessario === true && 
                <ButtonClickUI 
                    label='Ajustar banco de dados' 
                    onPress={ajustarDBOnPress} 
                />
            }            
        </ScrollViewUI>
    )
};

export default Ajustes;