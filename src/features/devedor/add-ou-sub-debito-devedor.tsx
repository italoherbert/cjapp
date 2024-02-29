import { useEffect, useState } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamsList } from "../../shared/screens/StackParamsList";

import ScrollViewUI from "../../shared/ui/ScrollViewUI";
import TextInputUI from "../../shared/ui/TextInputUI";
import TitleUI from "../../shared/ui/TitleUI";
import ButtonClickUI from "../../shared/ui/ButtonClickUI";
import MessageUI, { MessageType } from "../../shared/ui/MessageUI";

import { handleError } from "../../shared/error/error-handler";

import * as numberUtil from '../../core/util/number-util';

import { Devedor } from "../../core/persistence/model/devedor";
import * as devedorService from '../../core/persistence/service/devedor-service';
import { useSQLiteContext } from "expo-sqlite/next";
import { MessageError } from "../../core/error/MessageError";
import { useIsFocused } from "@react-navigation/native";
import BoxFieldUI from "../../shared/ui/BoxFieldUI";
import TextUI from "../../shared/ui/TextUI";
import ButtonIconUI from "../../shared/ui/ButtonIconUI";
import { faList } from "@fortawesome/free-solid-svg-icons";
import SimpleFieldUI from "../../shared/ui/SimpleFieldUI";
import ViewUI from "../../shared/ui/ViewUI";

function AddOuSubDebitoDevedor ( 
        { navigation, route } : NativeStackScreenProps<StackParamsList, 'AddOuSubDebitoDevedor'>) : React.JSX.Element {

    const [messageContent, setMessageContent] = useState<string>('');
    const [messageType, setMessageType] = useState<MessageType>('info');
    const [messageVisible, setMessageVisible] = useState<boolean>(false);

    const [debito, setDebito] = useState<number>(0);
    const [devedorNome, setDevedorNome] = useState<string>('');

    const [debitoIncDec, setDebitoIncDec] = useState<string>('');
    const [valorNegativo, setValorNegativo] = useState<boolean>(false);

    const db = useSQLiteContext();
    const isFocused = useIsFocused();

    const carregaDevedor = async () => {
        if ( route.params.id > 0 ) {
            try {                
                let devedor : Devedor = await devedorService.getDevedorPorId( db, route.params.id );
                setDebito( devedor.valor );
                setDevedorNome( devedor.nome );
            } catch ( error ) {
                handleError( error, setMessageContent, setMessageVisible, setMessageType );
            }
        }
    };

    const addOuSubOnPress = async () => {
        try {
            if ( route.params.id > 0 ) {
                if ( numberUtil.isNumber( debitoIncDec ) === false )
                    throw new MessageError( 'Valor em formato inválido.' );
                    
                let val = numberUtil.stringToNumber( debitoIncDec );
                if ( valorNegativo === true )
                    val *= -1;

                let devedor : Devedor = await devedorService.getDevedorPorId( db, route.params.id );
                devedor.valor = devedor.valor + val;       
                
                await devedorService.salvaDevedor( db, devedor );

                setDebito( devedor.valor );
                setDebitoIncDec( '' );

                setMessageContent( 'Débito atualizado com sucesso.' );
                setMessageType( 'info' );
                setMessageVisible( true );
            }
        } catch ( error ) {
            handleError( error, setMessageContent, setMessageVisible, setMessageType );
        }
    };

    useEffect( () => {
        if ( isFocused )
            carregaDevedor();
    }, [isFocused, route.params.id] );

    return (
        <ScrollViewUI>
            <ButtonIconUI 
                  label='Devedores'
                  icon={faList}
                  flex={1}
                  onPress={() => navigation.navigate( 'TelaDevedores' )}
            />

            <TitleUI title="Add/Sub Débito" />

            <ViewUI isRow={true} justifyContent="center">                
                <TextUI variant='primary' size="big">
                    {devedorNome}
                </TextUI>
            </ViewUI>

            <BoxFieldUI flex={1} isRow={false} 
                  marginVertical={5} 
                  alignItems='center'
                  background='light'
                  padding={10}>
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Débito</TextUI>
                <TextUI 
                      variant='danger' 
                      size='big-x'>
                  {numberUtil.formatBRL( debito )}
                </TextUI>
              </BoxFieldUI>  
            </BoxFieldUI>

            <ViewUI isRow={true} flex={6} marginBottom={10}>
                <ViewUI flex={1}>
                    <ButtonClickUI 
                        label={valorNegativo === true ? '-' : '+' }
                        onPress={() => setValorNegativo( !valorNegativo )}                        
                    />
                </ViewUI>
                <ViewUI marginLeft={10} flex={5}>
                    <TextInputUI   
                        defaultValue={debitoIncDec}
                        setValue={setDebitoIncDec}
                        placeholder="Informe o valor" />
                </ViewUI>
            </ViewUI>
            <ButtonClickUI
                label="Add/Sub valor"
                onPress={addOuSubOnPress}
            />

            <MessageUI type={messageType}
                    visible={messageVisible}
                    setVisible={setMessageVisible}>
                {messageContent}
            </MessageUI>
        </ScrollViewUI>
    );
}

export default AddOuSubDebitoDevedor;