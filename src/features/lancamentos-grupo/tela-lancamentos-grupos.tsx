import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';

import Dialog from 'react-native-dialog';

import { useSQLiteContext } from 'expo-sqlite/next';
import { useIsFocused } from '@react-navigation/native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamsList } from '../../shared/screens/StackParamsList';

import { faBoxOpen, faClose, faPlus, faX } from '@fortawesome/free-solid-svg-icons';

import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import ViewUI from "../../shared/ui/ViewUI";
import TitleUI from '../../shared/ui/TitleUI';
import TextUI from '../../shared/ui/TextUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';

import * as dateUtil from '../../core/util/date-util';

import * as lancamentosGruposService from '../../core/persistence/service/lancamentos-grupo-service';
import { LancamentosGrupo } from '../../core/persistence/model/lancamentos-grupo';

import { handleError } from '../../shared/error/error-handler';
import SelectBoxUI from '../../shared/ui/SelectBoxUI';
import SnackbarUI from '../../shared/ui/SnackbarUI';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const MAX_SHOW_REGS = 12;

function TelaLancamentosGrupos ( 
        { route, navigation } : NativeStackScreenProps<StackParamsList, 'TelaLancamentosGrupos'> ) : React.JSX.Element {

    const [removerDialogVisivel, setRemoverDialogVisivel] = useState<boolean>(false);

    const [grupos, setGrupos] = useState<LancamentosGrupo[]>([]);
    const [grupoAberto, setGrupoAberto] = useState<boolean>(false);
    const [ativosVisible, setAtivosVisible] = useState<boolean>(true);

    const db = useSQLiteContext();
    const isFocused = useIsFocused();

    const carregaTela = async () => {
        try {
            let grp = await lancamentosGruposService.getGrupoAberto( db );
            if ( grp !== null )
                setGrupoAberto( grp.aberto == true ); 
            else setGrupoAberto( false );

            let grps = await lancamentosGruposService.getGruposPorQuant( db, MAX_SHOW_REGS, true );
            setGrupos( grps );
            setAtivosVisible( true );
        } catch ( error : any ) {
            handleError( error );
        }
    };

    const abrirUltimoGrupoOnPress = async () => {
        try {
            await lancamentosGruposService.abreUltimoGrupo( db );

            let grps = await lancamentosGruposService.getGruposPorQuant( db, MAX_SHOW_REGS, true );
            setGrupos( grps );
            setGrupoAberto( true );

            SnackbarUI.showInfo( "Grupo aberto com sucesso. " );
        } catch ( error : any ) {
            handleError( error );
        }
    };

    const removerGrupoOnPress = async ( gid : number ) => {
        try {
            await lancamentosGruposService.deletaGrupoPorId( db, gid );

            let grps = await lancamentosGruposService.getGruposPorQuant( db, MAX_SHOW_REGS, false );
            setGrupos( grps );

            setRemoverDialogVisivel( false );

            SnackbarUI.showInfo( 'Grupo removido com sucesso.' );
        } catch ( error : any ) {
            handleError( error );
        }
    };  

    const ativosSelectOnPress = async () => {
        try {
            let grps = await lancamentosGruposService.getGruposPorQuant( db, MAX_SHOW_REGS, true );
            setGrupos( grps );
            setAtivosVisible( true );
        } catch ( error : any ) {
            handleError( error );
        }
    };

    const desativadosSelectOnPress = async () => {
        try {
            let grps = await lancamentosGruposService.getGruposPorQuant( db, MAX_SHOW_REGS, false );
            setGrupos( grps );
            setAtivosVisible( false );
        } catch ( error : any ) {
            handleError( error );
        }
    };

    const getDataFimStr = ( dataFim? : Date ) => {
        if ( dataFim === undefined || dataFim === null )
            return "o momento";
        if ( new Date( dataFim ).getTime() === 0 )
            return "o momento";

        return dateUtil.formatDate( dataFim );
    };    

    useEffect( () => {
        if ( isFocused )
            carregaTela();
    }, [isFocused] );

    return (
        <ScrollViewUI>
            <ViewUI isRow={true} flex={1}>                
                { grupoAberto === false && 
                    <ViewUI isRow={true} flex={1}>
                        <ButtonIconUI 
                            label='Novo grupo'
                            icon={faPlus}
                            flex={1}
                            onPress={ () => navigation.navigate( 'NovoLancamentosGrupo' )}
                        />

                        <ButtonIconUI 
                            label='Abre grupo'
                            icon={faBoxOpen}
                            flex={1}
                            marginType='left'
                            onPress={ abrirUltimoGrupoOnPress }
                        />
                    </ViewUI>
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

            <TitleUI title='Lista de grupos' />      

            <ViewUI marginBottom={10}>
                <SelectBoxUI op1Rotulo="Ativos"
                    op1OnSelect={ativosSelectOnPress} 
                    op2Rotulo='Desativados' 
                    op2OnSelect={desativadosSelectOnPress} 
                    defaultOpSelectedIndex={ativosVisible === true ? 1 : 2} 
                /> 
            </ViewUI>

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
                                {dateUtil.formatDate( grupo.dataIni ) + 
                                ' até ' + 
                                getDataFimStr( grupo.dataFim )}
                            </TextUI>
                            <ViewUI isRow={true} alignItems="center">                                
                                { grupo.ativo == true &&
                                    <TextUI variant={grupo.aberto ? 'success' : 'dark' }>
                                        {grupo.aberto == true ? 'aberto' : 'fechado' }
                                    </TextUI>
                                }
                                { grupo.ativo == false && 
                                    <Pressable onPress={() => setRemoverDialogVisivel( true )}>
                                        <ViewUI paddingHorizontal={10}>
                                            <FontAwesomeIcon icon={faX} color="red" />
                                        </ViewUI>
                                        <Dialog.Container visible={removerDialogVisivel}>
                                            <Dialog.Title>Remoção de grupo</Dialog.Title>
                                            <Dialog.Description>
                                                Tem certeza que deseja remover este grupo?
                                            </Dialog.Description>
                                            <Dialog.Button label="Remover grupo" onPress={() => removerGrupoOnPress( grupo.id )} />
                                            <Dialog.Button label="Cancelar" onPress={() => setRemoverDialogVisivel( false )} />                  
                                        </Dialog.Container>
                                    </Pressable>
                                }                                                                                                        
                            </ViewUI>
                            
                        </ViewUI>                      
                    </Pressable>
                </ViewUI>                
            ) }            
        </ScrollViewUI>
    );
}        

export default TelaLancamentosGrupos;