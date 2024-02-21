
import { useEffect, useState } from "react";
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
import TextUI from "../../shared/ui/TextUI";

import MostraBalancoResumidoUI from "../../shared/components/mostra-balanco-resumido-ui";

import { handleError } from "../../shared/error/error-handler";
import { MessageError } from "../../core/error/MessageError";

import * as lancamentoService from '../../core/persistence/service/lancamento-service';
import * as lancamentosGrupoService from '../../core/persistence/service/lancamentos-grupo-service';
import * as lancamentoLogica from '../../core/logica/lancamento-logica';

import { LancamentosGrupo } from "../../core/persistence/model/lancamentos-grupo";
import { Lancamento } from "../../core/persistence/model/lancamento";

function FechaLancamentosGrupo ( 
        { navigation, route } : NativeStackScreenProps<StackParamsList, 'FechaLancamentosGrupo'> ) : React.JSX.Element {

    const [fecharDialogVisivel, setFecharDialogVisivel] = useState<boolean>(false);
    const [grupoFechado, setGrupoFechado] = useState<boolean>(false);
    
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
            handleError( error );
        }
    };

    const fecharGrupoOnPress = async () => {
        try {                              
            await lancamentosGrupoService.fechaGrupo( db, grupo.id );                       
            
            setGrupoFechado( true );
            setFecharDialogVisivel( false );
        } catch ( error ) {
            handleError( error );
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

            { grupoFechado === true && 
                <TextUI marginVertical={10} variant="primary">
                    Grupo fechado.
                </TextUI>
            }

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
                <Dialog.Button label="Fechar grupo" onPress={fecharGrupoOnPress} />
                <Dialog.Button label="Cancelar" onPress={() => setFecharDialogVisivel( false )} />                  
            </Dialog.Container>

        </ScrollViewUI>
    );
}

export default FechaLancamentosGrupo;