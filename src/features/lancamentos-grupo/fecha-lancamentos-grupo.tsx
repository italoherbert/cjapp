
import { useCallback, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite/next";

import { faList } from "@fortawesome/free-solid-svg-icons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamsList } from "../../shared/screens/StackParamsList";

import Dialog from 'react-native-dialog';

import ScrollViewUI from "../../shared/ui/ScrollViewUI";
import ViewUI from "../../shared/ui/ViewUI";
import TitleUI from "../../shared/ui/TitleUI";
import ButtonClickUI from "../../shared/ui/ButtonClickUI";
import ButtonIconUI from "../../shared/ui/ButtonIconUI";

import MostraBalancoResumidoUI from "../../shared/components/mostra-balanco-resumido-ui";
import MessageUI, { MessageType } from "../../shared/ui/MessageUI";

import { handleError } from "../../shared/error/error-handler";
import { MessageError } from "../../core/error/MessageError";

import * as lancamentoService from '../../core/persistence/service/lancamento-service';
import * as lancamentosGrupoService from '../../core/persistence/service/lancamentos-grupo-service';

import { LancamentosGrupo } from "../../core/persistence/model/lancamentos-grupo";
import { Lancamento } from "../../core/persistence/model/lancamento";

function FechaLancamentosGrupo ( 
        { navigation, route } : NativeStackScreenProps<StackParamsList, 'FechaLancamentosGrupo'> ) : React.JSX.Element {

    const [fecharDialogVisivel, setFecharDialogVisivel] = useState<boolean>(false);
    
    const [messageContent, setMessageContent] = useState<string>('');
    const [messageType, setMessageType] = useState<MessageType>('info');
    const [messageVisible, setMessageVisible] = useState<boolean>(false);
    
    const [grupo, setGrupo] = useState<LancamentosGrupo>( new LancamentosGrupo() );
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
    
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const carregaGrupo = async () => {
        try {            
            let grp = await lancamentosGrupoService.getGrupoAberto( db );
            if ( grp === null )
                throw new MessageError( 'Nenhum grupo de lançamentos aberto.' );

            let lancs = await lancamentoService.getLancamentosPorGrupoId( db, grp.id );                        

            setLancamentos( lancs );
            setGrupo( grp );
        } catch ( error ) {
            handleError( error, setMessageContent, setMessageVisible, setMessageType );
        }
    };

    const fecharGrupoOnPress = async () => {
        try {                              
            await lancamentosGrupoService.fechaGrupo( db, grupo.id );                       
                        
            setFecharDialogVisivel( false );        
           
            setMessageContent( 'Grupo fechado com sucesso.')
            setMessageType( 'info' );
            setMessageVisible( true );
        } catch ( error ) {
            handleError( error, setMessageContent, setMessageVisible, setMessageType );
        }
    };

    useEffect( () => {
        if ( isFocused )
            carregaGrupo();
    }, [isFocused ] );

    return (
        <ScrollViewUI>
            <ViewUI isRow={true}>
                <ButtonIconUI 
                    label="Lista de grupos"
                    icon={faList}
                    flex={1}
                    onPress={() => navigation.navigate( 'TelaLancamentosGrupos' )} 
                />
            </ViewUI>

            <TitleUI title="Fechamento de grupo" />

            <MostraBalancoResumidoUI lancamentos={lancamentos} />

            <ViewUI marginTop={10}>
                <ButtonClickUI
                    label="Fechar grupo aberto" 
                    onPress={() => setFecharDialogVisivel( true )} />
            </ViewUI>

            <Dialog.Container visible={fecharDialogVisivel}>
                <Dialog.Title>Fechamento de grupo aberto</Dialog.Title>
                <Dialog.Description>
                    Tem certeza que deseja fechar o grupo?
                </Dialog.Description>
                <Dialog.Button label="Fechar grupo" onPress={() => fecharGrupoOnPress() } />
                <Dialog.Button label="Cancelar" onPress={() => setFecharDialogVisivel( false )} />                  
            </Dialog.Container>

            <MessageUI type={messageType} 
                    visible={messageVisible}
                    setVisible={setMessageVisible}>
                {messageContent}
            </MessageUI> 

        </ScrollViewUI>
    );
}

export default FechaLancamentosGrupo;