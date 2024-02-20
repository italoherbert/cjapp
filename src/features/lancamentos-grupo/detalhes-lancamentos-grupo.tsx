
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite/next";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamsList } from "../../shared/screens/StackParamsList";

import Dialog from 'react-native-dialog';

import ViewUI from "../../shared/ui/ViewUI";

import { handleError } from "../../shared/error/error-handler";
import { MessageError } from "../../core/error/MessageError";

import * as converter from '../../core/converter/converter';

import * as lancamentosGrupoService from '../../core/persistence/service/lancamentos-grupo-service';
import { LancamentosGrupo } from "../../core/persistence/model/lancamentos-grupo";
import ScrollViewUI from "../../shared/ui/ScrollViewUI";
import SimpleFieldUI from "../../shared/ui/SimpleFieldUI";
import TextUI from "../../shared/ui/TextUI";
import TitleUI from "../../shared/ui/TitleUI";
import ButtonIconUI from "../../shared/ui/ButtonIconUI";
import { faList, faX } from "@fortawesome/free-solid-svg-icons";
import SnackbarUI from "../../shared/ui/SnackbarUI";

function DetalhesLancamentosGrupo ( 
        { navigation, route } : NativeStackScreenProps<StackParamsList, 'DetalhesLancamentosGrupo'> ) : React.JSX.Element {

    const [grupo, setGrupo] = useState<LancamentosGrupo>(new LancamentosGrupo());
    const [removido, setRemovido] = useState<boolean>(false);
    const [removerDialogVisivel, setRemoverDialogVisivel] = useState<boolean>(false);

    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const carregaDetalhes = async () => {
        try {
            if ( route.params.id <= 0 )
                throw new MessageError( 'ID de grupo de lançamento inválido.' );

            let grp = await lancamentosGrupoService.getGrupoPorId( db, route.params.id );
            setGrupo( grp );
        } catch ( error ) {
            handleError( error );
        }
    };

    const removerOnPress = async () => {
        try {
            if ( route.params.id <= 0 )
                throw new MessageError( 'ID de grupo de lançamento inválido.' );

            await lancamentosGrupoService.deletaGrupoPorId( db, route.params.id );
            setRemovido( true );

            SnackbarUI.showInfo( 'Grupo deletado com sucesso.' );
        } catch ( error ) {
            handleError( error );
        }
    };

    const getDataFimStr = ( dataFim : Date ) => {
        if ( dataFim === undefined || dataFim === null )
            return "Não definida.";
        if ( new Date( dataFim ).getTime() === 0 )
            return "Não definida.";

        return converter.formatDate( dataFim );            
    };

    useEffect( () => {
        if ( isFocused )
            carregaDetalhes();
    }, [isFocused] );

    return (
        <ScrollViewUI>
            <ViewUI isRow={true}>
                <ButtonIconUI 
                    label="Listar grupos"
                    icon={faList}
                    flex={1}
                    onPress={ () => navigation.navigate( 'TelaLancamentosGrupos' ) }
                />
            </ViewUI>
            
            <TitleUI title="Detalhes do grupo" />

            <SimpleFieldUI>
                <TextUI>Data inicial</TextUI>
                <TextUI>{converter.formatDate( grupo.dataIni )}</TextUI>
            </SimpleFieldUI>

            <SimpleFieldUI>
                <TextUI>Data final</TextUI>
                <TextUI>{getDataFimStr( grupo.dataFim! )}</TextUI>
            </SimpleFieldUI>

            <SimpleFieldUI>
                <TextUI>Aberto</TextUI>
                <TextUI variant={grupo.aberto == true ? 'success' : 'primary'}>
                    {grupo.aberto == true ? 'Sim' : 'Não'}
                </TextUI>
            </SimpleFieldUI>

            { removido === true && 
            <TextUI variant='danger' marginVertical={10}>
                    Removido!
            </TextUI>
            }

            <ViewUI isRow={true} marginVertical={10}>                                                 
                <ButtonIconUI 
                    label='Remover'
                    icon={faX}
                    flex={1}
                    variant='danger' 
                    disable={removido}                     
                    onPress={() => setRemoverDialogVisivel( !removerDialogVisivel )}
                />                                   
            </ViewUI>

            <Dialog.Container visible={removerDialogVisivel}>
            <Dialog.Title>Remoção de grupo</Dialog.Title>
            <Dialog.Description>
                Tem certeza que deseja remover este grupo?
            </Dialog.Description>
                <Dialog.Button label="Remover" onPress={removerOnPress} />
                <Dialog.Button label="Cancelar" onPress={() => setRemoverDialogVisivel( false )} />                  
            </Dialog.Container>

        </ScrollViewUI>
    );
}

export default DetalhesLancamentosGrupo;