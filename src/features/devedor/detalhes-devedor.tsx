import React, { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 
import { useIsFocused } from '@react-navigation/native';

import Dialog from 'react-native-dialog';

import { faAdd, faEdit, faList, faPlus, faX } from '@fortawesome/free-solid-svg-icons';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import * as dateUtil from '../../core/util/date-util';
import * as numberUtil from '../../core/util/number-util';

import * as devedorService from '../../core/persistence/service/devedor-service';
import {Devedor} from '../../core/persistence/model/devedor';
import { MessageError } from '../../core/error/MessageError';

import { handleError } from '../../shared/error/error-handler';

import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';
import SimpleFieldUI from '../../shared/ui/SimpleFieldUI';
import TextUI from '../../shared/ui/TextUI';
import ViewUI from '../../shared/ui/ViewUI';
import MessageUI, { MessageType } from '../../shared/ui/MessageUI';
  
const DetalhesDevedor = ( { navigation, route  } : NativeStackScreenProps<StackParamsList, 'DetalhesDevedor'> ): React.JSX.Element => {
  
    const [removido, setRemovido] = useState<boolean>(false);
    const [removerDialogVisivel, setRemoverDialogVisivel] = useState<boolean>(false);
    
    const [messageContent, setMessageContent] = useState<string>('');
    const [messageType, setMessageType] = useState<MessageType>('info');
    const [messageVisible, setMessageVisible] = useState<boolean>(false);
    
    const [devedor, setDevedor] = useState<Devedor>(new Devedor()); 
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const loadTela = useCallback( async () => {
      if ( route.params.id > 0 ) {
        try {
          let devedor = await devedorService.getDevedorPorId( db, route.params.id );
          setDevedor( devedor! );
          setRemovido( false );
        } catch ( error ) {
          handleError( error, setMessageContent, setMessageVisible, setMessageType );
        }
      }
    }, [route.params.id] );

    useEffect( () => {
      if ( isFocused )
        loadTela();
    }, [ isFocused ] );

    const removerOnPress = async () => {
      setRemoverDialogVisivel( false );

      try {
          let id = route.params.id;
          if ( id <= 0 )
            throw new MessageError( 'Nenhum devedor selecionado para remoção.' );
          
          await devedorService.deletaDevedorPorId( db, id );
          setRemovido( true );

          setMessageContent( 'Devedor removido com sucesso.' );
          setMessageType( 'info' );
          setMessageVisible( true );
      } catch ( error ) {
        handleError( error, setMessageContent, setMessageVisible, setMessageType );
      }    
    };
  
    return (
      <ScrollViewUI>
        <ViewUI>
            <ButtonIconUI 
                  label='Devedores'
                  icon={faList}
                  flex={1}
                  onPress={() => navigation.navigate( 'TelaDevedores' )}
            />

            <TitleUI title='Detalhes do Devedor' />

            <SimpleFieldUI>
              <TextUI>
                Data débito
              </TextUI>
              <TextUI variant='normal'>
                {dateUtil.formatDate( devedor.dataDebito )}
              </TextUI>
            </SimpleFieldUI>

            <SimpleFieldUI>
              <TextUI>
                Valor: 
              </TextUI>
              <TextUI variant='danger'>
                {numberUtil.formatBRL( devedor.valor )}
              </TextUI>
            </SimpleFieldUI>
            
            <SimpleFieldUI>
              <TextUI>
                Tempo
              </TextUI>
              <TextUI variant='primary'>
                {devedor.antigo == true ? 'Antigo' : 'Novo' }
              </TextUI>
            </SimpleFieldUI>

            { removido === true && 
              <TextUI variant='danger' marginVertical={10}>
                  Removido!
              </TextUI>              
            }
            
            <ViewUI isRow={true} marginVertical={10} flex={5} justifyContent="center">                                          
              <ViewUI flex={2}></ViewUI>
              <ButtonIconUI 
                  label='+/-'
                  icon={faAdd}
                  flex={1}                
                  onPress={() => navigation.navigate( 'AddOuSubDebitoDevedor', { id: route.params.id } )}
              />               
              <ViewUI flex={2}></ViewUI>
            </ViewUI>

            <ViewUI isRow={true}>
              <ButtonIconUI 
                  label='Novo'
                  icon={faPlus}
                  flex={1}
                  onPress={() => navigation.navigate( 'SalvaDevedor', { id: -1 } )}
              /> 

              <ButtonIconUI 
                  label='Editar'
                  icon={faEdit}
                  flex={1}
                  marginType='both'
                  disable={removido}
                  onPress={() => navigation.navigate( 'SalvaDevedor', { id: route.params.id } )}
              /> 

              <ButtonIconUI 
                  label='Remover'
                  icon={faX}
                  flex={1}
                  variant='danger'
                  disable={removido}
                  onPress={() => setRemoverDialogVisivel( !removerDialogVisivel )}
              />            
            </ViewUI>          
        </ViewUI>

        <Dialog.Container visible={removerDialogVisivel}>
            <Dialog.Title>Remoção de devedor</Dialog.Title>
            <Dialog.Description>
              Tem certeza que deseja remover este devedor?
            </Dialog.Description>
            <Dialog.Button label="Remover" onPress={removerOnPress} />
            <Dialog.Button label="Cancelar" onPress={() => setRemoverDialogVisivel( false )} />                  
        </Dialog.Container>

        <MessageUI type={messageType} 
                visible={messageVisible}
                setVisible={setMessageVisible}>
            {messageContent}
        </MessageUI> 

      </ScrollViewUI>
    );
    
  }
    
  export default DetalhesDevedor;
  