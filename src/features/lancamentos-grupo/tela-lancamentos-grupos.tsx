import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';

import { useSQLiteContext } from 'expo-sqlite/next';
import { useIsFocused } from '@react-navigation/native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamsList } from '../../shared/screens/StackParamsList';

import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';

import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import ViewUI from "../../shared/ui/ViewUI";
import TitleUI from '../../shared/ui/TitleUI';
import TextUI from '../../shared/ui/TextUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';

import * as converter from '../../core/converter/converter';

import * as lancamentosGruposService from '../../core/persistence/service/lancamentos-grupo-service';
import { LancamentosGrupo } from '../../core/persistence/model/lancamentos-grupo';

import { handleError } from '../../shared/error/error-handler';
import { MessageError } from '../../core/error/MessageError';
import SnackbarUI from '../../shared/ui/SnackbarUI';

const MAX_SHOW_REGS = 12;

function TelaLancamentosGrupos ( 
        { route, navigation } : NativeStackScreenProps<StackParamsList, 'TelaLancamentosGrupos'> ) : React.JSX.Element {

    const [grupos, setGrupos] = useState<LancamentosGrupo[]>([]);
    const [grupoAberto, setGrupoAberto] = useState<boolean>(true);

    const db = useSQLiteContext();
    const isFocused = useIsFocused();

    const carregaTela = async () => {
        try {
            let aberto = await lancamentosGruposService.getGrupoAberto( db );
            setGrupoAberto( aberto !== null ); 

            let grps = await lancamentosGruposService.getGruposPorQuant( db, MAX_SHOW_REGS );
            setGrupos( grps );
        } catch ( error : any ) {
            handleError( error );
        }
    };

    const getDataFimStr = ( dataFim? : Date ) => {
        if ( dataFim === undefined || dataFim === null )
            return " o momento";
        if ( new Date( dataFim ).getTime() === 0 )
            return " o momento";

        return converter.formatDate( dataFim );
    };    

    useEffect( () => {
        if ( isFocused )
            carregaTela();
    }, [isFocused] );

    return (
        <ScrollViewUI>
            <ViewUI isRow={true} flex={2}>                
                { grupoAberto === false && 
                    <ButtonIconUI 
                        label='Novo grupo'
                        icon={faPlus}
                        flex={1}
                        onPress={ () => navigation.navigate( 'NovoLancamentosGrupo' )}
                    />
                }
                { grupoAberto === true && 
                    <ButtonIconUI 
                        label='Fechar grupo'
                        icon={faClose}
                        flex={1}
                        onPress={ () => navigation.navigate( 'FechaLancamentosGrupo' )}
                    />
                }
            </ViewUI>

            <TitleUI title='Lista de lançamentos' />      
                    
            {grupos.map( ( grupo : LancamentosGrupo, index : number ) => 
                <ViewUI key={index}>
                    <Pressable 
                        onPress={() => navigation.navigate( 'DetalhesLancamentosGrupo', { id : grupo.id } ) }>
                        <ViewUI 
                                padding={12} 
                                background='light'
                                border='light-x' 
                                isRow={true}
                                justifyContent="space-between">

                            <TextUI variant='dark-x'>
                                {converter.formatDate( grupo.dataIni ) + 
                                ' até ' + 
                                getDataFimStr( grupo.dataFim )}
                            </TextUI>
                        </ViewUI>                      
                    </Pressable>
                </ViewUI>                
            ) }
        </ScrollViewUI>
    );
}        

export default TelaLancamentosGrupos;