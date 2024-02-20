
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite/next";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamsList } from "../../shared/screens/StackParamsList";

import Dialog from 'react-native-dialog';

import ScrollViewUI from "../../shared/ui/ScrollViewUI";
import ViewUI from "../../shared/ui/ViewUI";
import TitleUI from "../../shared/ui/TitleUI";
import ButtonClickUI from "../../shared/ui/ButtonClickUI";
import SnackbarUI from "../../shared/ui/SnackbarUI";
import TextUI from "../../shared/ui/TextUI";
import BoxFieldUI from "../../shared/ui/BoxFieldUI";

import { handleError } from "../../shared/error/error-handler";
import { MessageError } from "../../core/error/MessageError";

import * as converter from '../../core/converter/converter';

import * as lancamentoService from '../../core/persistence/service/lancamento-service';
import * as lancamentosGrupoService from '../../core/persistence/service/lancamentos-grupo-service';
import * as lancamentoLogica from '../../core/logica/lancamento-logica';

import { LancamentosGrupo } from "../../core/persistence/model/lancamentos-grupo";
import { LancTotais } from "../../core/logica/model/lanc-totais";
import { Lancamento } from "../../core/persistence/model/lancamento";
import ButtonIconUI from "../../shared/ui/ButtonIconUI";
import { faList } from "@fortawesome/free-solid-svg-icons";

function FechaLancamentosGrupo ( 
        { navigation, route } : NativeStackScreenProps<StackParamsList, 'FechaLancamentosGrupo'> ) : React.JSX.Element {

    const [fecharDialogVisivel, setFecharDialogVisivel] = useState<boolean>(false);
    
    const [grupo, setGrupo] = useState<LancamentosGrupo>( new LancamentosGrupo() );
    const [creditoTotalGeral, setCreditoTotalGeral] = useState<number>(0);
    const [debitoTotalGeral, setDebitoTotalGeral] = useState<number>(0);
    const [totalGeral, setTotalGeral] = useState<number>(0);
    const [totalEmContaCorrente, setTotalEmContaCorrente] = useState<number>(0);
    const [totalEmEspecie, setTotalEmEspecie] = useState<number>(0);

    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const carregaGrupo = async () => {
        try {            
            let grp = await lancamentosGrupoService.getGrupoAberto( db );
            if ( grp === null )
                throw new MessageError( 'Nenhum grupo de lançamentos aberto.' );

            let lancs = await lancamentoService.getLancamentosPorGrupoId( db, grp.id );            
            let totais = await lancamentoLogica.carregaTotais( lancs );

            setTotalEmEspecie( totais.totalEmEspecie );
            setTotalEmContaCorrente( totais.totalEmContaCorrente );
            
            setCreditoTotalGeral( totais.creditoTotalGeral );
            setDebitoTotalGeral( totais.debitoTotalGeral );
            setTotalGeral( totais.totalGeral );

            setGrupo( grp );
        } catch ( error ) {
            handleError( error );
        }
    };

    const fecharGrupoOnPress = async () => {
        try {                              
            await lancamentosGrupoService.fechaGrupo( db, grupo.id, totalEmEspecie, totalEmContaCorrente );            

            let grp = await lancamentosGrupoService.getGrupoPorId( db, grupo.id );
            setGrupo( grp );

            SnackbarUI.showInfo( 'Grupo fechado com sucesso.' );
        } catch ( error ) {
            handleError( error );
        }
    };

    useEffect( () => {
        if ( isFocused )
            carregaGrupo();
    }, [isFocused] );

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

            <BoxFieldUI flex={2} isRow={true} marginVertical={5}> 
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Crédito Geral</TextUI>
                <TextUI variant='primary' size='big-x'>
                  {converter.formatBRL( creditoTotalGeral )}
                </TextUI>
              </BoxFieldUI>

              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Débito Geral</TextUI>
                <TextUI variant='danger' size='big-x'>
                  {converter.formatBRL( debitoTotalGeral )}
                </TextUI>
              </BoxFieldUI>             
            </BoxFieldUI>

            <BoxFieldUI flex={1} isRow={false} 
                  marginVertical={5} 
                  alignItems='center'
                  background='light' 
                  padding={10}>
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Lucro</TextUI>
                <TextUI 
                      variant={ totalGeral < 0 ? 'danger' : 'normal' } 
                      size='big-x'>
                  {converter.formatBRL( totalGeral )}
                </TextUI>
              </BoxFieldUI>  
            </BoxFieldUI>

            <ButtonClickUI 
                label="Fechar grupo aberto" 
                onPress={() => setFecharDialogVisivel( true )} />

            <Dialog.Container visible={fecharDialogVisivel}>
                <Dialog.Title>Fechamento de grupo aberto</Dialog.Title>
                <Dialog.Description>
                    Tem certeza que deseja zerar as contas e fechar o grupo?
                </Dialog.Description>
                <Dialog.Button label="Criar novo" onPress={fecharGrupoOnPress} />
                <Dialog.Button label="Cancelar" onPress={() => setFecharDialogVisivel( false )} />                  
            </Dialog.Container>

        </ScrollViewUI>
    );
}

export default FechaLancamentosGrupo;