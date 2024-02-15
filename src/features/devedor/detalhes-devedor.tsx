import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 
import { useIsFocused } from '@react-navigation/native';

import Dialog from 'react-native-dialog';

import { faEdit, faList, faX } from '@fortawesome/free-solid-svg-icons';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import globalStyle from '../../shared/style/global-style';

import { persistence } from '../../core/persistence/persistence';
import * as converter from '../../core/converter/converter';

import {Devedor} from '../../core/persistence/model/devedor';

import SnackbarUI from '../../shared/ui/SnackbarUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';
import SimpleFieldUI from '../../shared/ui/SimpleFieldUI';
import TextUI from '../../shared/ui/TextUI';
import ViewUI from '../../shared/ui/ViewUI';
  
const DetalhesDevedor = ( { navigation, route  } : NativeStackScreenProps<StackParamsList, 'DetalhesDevedor'> ): React.JSX.Element => {
    
    const [devedor, setDevedor] = useState<Devedor>(new Devedor()); 
    const [removido, setRemovido] = useState<boolean>(false);
    const [removerDialogVisivel, setRemoverDialogVisivel] = useState<boolean>(false);
    const isFocused = useIsFocused();

    const loadTela = useCallback( async () => {
      if ( route.params.id > 0 ) {
        let devedor = await persistence.devedorService.getDevedorPorId( route.params.id );
        setDevedor( devedor! );
      }
    }, [route.params.id] );

    useEffect( () => {
      if ( isFocused )
        loadTela();
    }, [ isFocused ] );

    const removerOnPress = async () => {
      setRemoverDialogVisivel( false );

      let id = route.params.id;
      if ( id <= 0 ) {
        SnackbarUI.showDanger( 'Nenhum devedor selecionado para remoção.' );
      } else {
        try {
          persistence.devedorService.deletaDevedorPorId( id );
          setRemovido( true );

          SnackbarUI.showInfo( 'Devedor removido com sucesso.' );
        } catch ( error : any ) {
          Alert.alert( ''+error.message );
        }
      }
    };
  
    return (
      <ScrollViewUI>
        <ViewUI>
            <TitleUI title='Detalhes do Devedor' marginBottom={10} />

            <SimpleFieldUI>
              <TextUI>
                Data débito
              </TextUI>
              <TextUI variant='normal'>
                {converter.formatDate( devedor.dataDebito )}
              </TextUI>
            </SimpleFieldUI>

            <SimpleFieldUI>
              <TextUI>
                Valor: 
              </TextUI>
              <TextUI variant='danger'>
                {converter.formatBRL( devedor.valor )}
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
              <Text style={globalStyle.danger}>
                    Removido!
              </Text>
            }
            
            <ViewUI isRow={true}>
              { removido === false && 
                <ViewUI flex={2} isRow={true}>                  
                  <ButtonIconUI 
                      label='Remover'
                      icon={faX}
                      flex={1}
                      onPress={() => setRemoverDialogVisivel( !removerDialogVisivel )}
                  />
                  
                  <ButtonIconUI 
                      label='Editar'
                      icon={faEdit}
                      flex={1}
                      marginType='both'
                      onPress={() => navigation.navigate( 'SalvaDevedor', { id: route.params.id } )}
                  />
                </ViewUI>
              }     

              <ButtonIconUI 
                  label='Devedores'
                  icon={faList}
                  flex={1}
                  onPress={() => navigation.navigate( 'TelaDevedores' )}
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

      </ScrollViewUI>
    );
    
  }
  
  const styles = StyleSheet.create({      
          
  });
  
  export default DetalhesDevedor;
  