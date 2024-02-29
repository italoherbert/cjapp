
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite/next";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamsList } from "../../shared/screens/StackParamsList";

import { faCashRegister, faCheck, faList, faX } from "@fortawesome/free-solid-svg-icons";

import ViewUI from "../../shared/ui/ViewUI";
import ScrollViewUI from "../../shared/ui/ScrollViewUI";
import SimpleFieldUI from "../../shared/ui/SimpleFieldUI";
import TextUI from "../../shared/ui/TextUI";
import TitleUI from "../../shared/ui/TitleUI";
import ButtonIconUI from "../../shared/ui/ButtonIconUI";
import MessageUI, { MessageType } from "../../shared/ui/MessageUI";

import { handleError } from "../../shared/error/error-handler";
import { MessageError } from "../../core/error/MessageError";

import * as dateUtil from '../../core/util/date-util';

import * as lancamentosGrupoService from '../../core/persistence/service/lancamentos-grupo-service';
import { LancamentosGrupo } from "../../core/persistence/model/lancamentos-grupo";

function DetalhesLancamentosGrupo ( 
        { navigation, route } : NativeStackScreenProps<StackParamsList, 'DetalhesLancamentosGrupo'> ) : React.JSX.Element {

    const [grupo, setGrupo] = useState<LancamentosGrupo>(new LancamentosGrupo());
    const [desativado, setDesativado] = useState<boolean>(false);
    
    const [messageContent, setMessageContent] = useState<string>('');
    const [messageType, setMessageType] = useState<MessageType>('info');
    const [messageVisible, setMessageVisible] = useState<boolean>(false);

    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const carregaDetalhes = async () => {
        try {
            if ( route.params.id <= 0 )
                throw new MessageError( 'ID de grupo de lançamento inválido.' );

            let grp = await lancamentosGrupoService.getGrupoPorId( db, route.params.id );
            setGrupo( grp );

            setDesativado( grp.ativo == false );
        } catch ( error ) {
            handleError( error, setMessageContent, setMessageVisible, setMessageType );
        }
    };

    const ativarOnPress = async () => {
        try {
            if ( route.params.id <= 0 )
                throw new MessageError( 'ID de grupo de lançamento inválido.' );

            await lancamentosGrupoService.ativaGrupo( db, route.params.id );
            let grp = await lancamentosGrupoService.getGrupoPorId( db, route.params.id );

            setGrupo( grp );
            setDesativado( false );

            setMessageContent( 'Grupo ativado com sucesso.')
            setMessageType( 'info' );
            setMessageVisible( true );
        } catch ( error ) {
            handleError( error, setMessageContent, setMessageVisible, setMessageType );
        }
    };

    const desativarOnPress = async () => {
        try {
            if ( route.params.id <= 0 )
                throw new MessageError( 'ID de grupo de lançamento inválido.' );

            await lancamentosGrupoService.desativaGrupo( db, route.params.id );
            let grp = await lancamentosGrupoService.getGrupoPorId( db, route.params.id );

            setGrupo( grp );
            setDesativado( true );
            
            setMessageContent( 'Grupo desativado com sucesso.')
            setMessageType( 'info' );
            setMessageVisible( true );
        } catch ( error ) {
            handleError( error, setMessageContent, setMessageVisible, setMessageType );
        }
    };

    const getDataFimStr = ( dataFim : Date ) => {
        if ( dataFim === undefined || dataFim === null )
            return "Não definida.";
        if ( new Date( dataFim ).getTime() === 0 )
            return "Não definida.";

        return dateUtil.formatDate( dataFim );            
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
                <TextUI>{dateUtil.formatDate( grupo.dataIni )}</TextUI>
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

            <SimpleFieldUI>
                <TextUI>Ativo</TextUI>
                <TextUI variant={grupo.ativo == true ? 'success' : 'primary'}>
                    {grupo.ativo == true ? 'Sim' : 'Não'}
                </TextUI>
            </SimpleFieldUI>

            <ViewUI isRow={true} marginTop={10}>                                                 
                { desativado === false &&
                    <ButtonIconUI 
                        label='Desativar'
                        icon={faX}
                        flex={1}
                        variant='danger' 
                        onPress={desativarOnPress}
                    />                                   
                }

                { desativado === true &&
                    <ButtonIconUI 
                        label='Ativar'
                        icon={faCheck}
                        flex={1}
                        onPress={ativarOnPress}
                    />                                   
                }

                { grupo.aberto == true && 
                    <ButtonIconUI 
                        label="Fechar"
                        icon={faX}
                        flex={1}
                        marginType="left"
                        onPress={ () => navigation.navigate( 'FechaLancamentosGrupo' ) }
                    />
                }               

                <ButtonIconUI 
                    label="Lançamentos"
                    icon={faCashRegister}
                    flex={1}
                    marginType="left"
                    onPress={ () => navigation.navigate( 'LancamentoScreens', { screen : 'ListaLancamentosPorGrupo', params: { gid : grupo.id } } ) }
                />
            </ViewUI>

            <MessageUI type={messageType} 
                    visible={messageVisible}
                    setVisible={setMessageVisible}>
                {messageContent}
            </MessageUI> 

        </ScrollViewUI>
    );
}

export default DetalhesLancamentosGrupo;