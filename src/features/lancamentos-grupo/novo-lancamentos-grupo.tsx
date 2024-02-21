
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";

import { faList } from "@fortawesome/free-solid-svg-icons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamsList } from "../../shared/screens/StackParamsList";

import Dialog from 'react-native-dialog';

import ScrollViewUI from "../../shared/ui/ScrollViewUI";
import TitleUI from "../../shared/ui/TitleUI";
import ButtonClickUI from "../../shared/ui/ButtonClickUI";
import ViewUI from "../../shared/ui/ViewUI";
import ButtonIconUI from "../../shared/ui/ButtonIconUI";

import { handleError } from "../../shared/error/error-handler";

import * as lancamentosGrupoService from '../../core/persistence/service/lancamentos-grupo-service';

function NovoLancamentosGrupo ( 
        { navigation, route } : NativeStackScreenProps<StackParamsList, 'NovoLancamentosGrupo'> ) : React.JSX.Element {

    const [removerDialogVisivel, setRemoverDialogVisivel] = useState<boolean>(false);   

    const db = useSQLiteContext();

    const novoOnPress = async () => {        
        try {                        
            let grupo = await lancamentosGrupoService.novoGrupo( db );
            navigation.navigate( 'DetalhesLancamentosGrupo', { id : grupo.id } );
        } catch ( error ) {
            handleError( error );
        }
    };

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

            <TitleUI title="Novo grupo" />

            <ButtonClickUI 
                label="Criar novo grupo" 
                onPress={() => setRemoverDialogVisivel( true )} />

            <Dialog.Container visible={removerDialogVisivel}>
                <Dialog.Title>Criação de novo grupo</Dialog.Title>
                <Dialog.Description>
                    Tem certeza que deseja criar um novo grupo?
                </Dialog.Description>
                <Dialog.Button label="Criar novo" onPress={novoOnPress} />
                <Dialog.Button label="Cancelar" onPress={() => setRemoverDialogVisivel( false )} />                  
            </Dialog.Container>

        </ScrollViewUI>
    );
}

export default NovoLancamentosGrupo;