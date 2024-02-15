import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';

import Dialog from 'react-native-dialog';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 
import { useIsFocused } from '@react-navigation/native';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import globalStyle from '../../shared/style/global-style';

import { persistence } from '../../core/persistence/persistence';
import * as converter from '../../core/converter/converter';

import {Lancamento} from '../../core/persistence/model/lancamento';
import SnackbarUI from '../../shared/ui/SnackbarUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import { faArrowCircleLeft, faEdit, faList, faX } from '@fortawesome/free-solid-svg-icons';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';
import SimpleFieldUI from '../../shared/ui/SimpleFieldUI';
import TextUI from '../../shared/ui/TextUI';

const DetalhesLancamento = ( { navigation, route  } : NativeStackScreenProps<StackParamsList, 'DetalhesLancamento'> ): React.JSX.Element => {
    
    const [lancamento, setLancamento] = useState<Lancamento>(new Lancamento()); 
    const [removerDialogVisivel, setRemoverDialogVisivel] = useState<boolean>(false);
    const [removido, setRemovido] = useState<boolean>(false);
    const isFocused = useIsFocused();

    const loadTela = useCallback( async () => {
      if ( route.params.id > 0 ) {
        let lancamento = await persistence.lancamentoService.getLancamentoPorId( route.params.id );
        setLancamento( lancamento );
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
        SnackbarUI.showDanger( 'Nenhum lancamento selecionado para remoção.' );
      } else {
        try {
          await persistence.lancamentoService.deletaLancamentoPorId( id );
          setRemovido( true );

          SnackbarUI.showInfo( 'Lancamento removido com sucesso.' );
        } catch ( error : any ) {
          Alert.alert( ''+error.message );
        }
      }
    };
  
    return (
      <ScrollViewUI>
        <TitleUI title='Detalhes do Lançamento' />

        <SimpleFieldUI>
          <TextUI>Descrição</TextUI>
          <TextUI>{lancamento.descricao}</TextUI>
        </SimpleFieldUI>

        <SimpleFieldUI>
          <TextUI>Data de registro</TextUI>
          <TextUI>
            {converter.formatDate( lancamento.dataLanc )}
          </TextUI>
        </SimpleFieldUI>

        <SimpleFieldUI>
          <TextUI>Valor</TextUI>
          <TextUI variant={ lancamento.valor < 0 ? 'danger' : 'primary' }>
            {converter.formatBRL( lancamento.valor )}
          </TextUI>
        </SimpleFieldUI>

        <SimpleFieldUI>
          <TextUI>Tipo</TextUI>
          <TextUI variant={ lancamento.tipo === 'debito' ? 'danger' : 'primary' }>
            {lancamento.tipo == 'debito' ? 'Débito' : 'Crédito' }
          </TextUI>
        </SimpleFieldUI>

        <SimpleFieldUI>
          <TextUI>Dinheiro</TextUI>
          <TextUI variant='success'>
            {lancamento.emContaCorrente == true ? 'Em conta' : 'Em espécie' }
          </TextUI>
        </SimpleFieldUI>

        <SimpleFieldUI>
          <TextUI>Do jogo</TextUI>
          <TextUI variant='success'>
            {lancamento.doJogo == true ? 'Sim' : 'Não' }
          </TextUI>
        </SimpleFieldUI>
            
        { removido === true && 
          <TextUI variant='danger'>
                Removido!
          </TextUI>
        }

        <View style={{flexDirection: 'row'}}>                                     
            { removido === false && 
              <View style={{flex: 2, flexDirection: 'row'}}>                
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
                      onPress={() => navigation.navigate( 'SalvaLancamento', { id: route.params.id } )}
                  />
              </View>
            }
            
            <ButtonIconUI 
                label='Lançamentos'
                icon={faList}
                flex={1}
                onPress={() => navigation.navigate( 'TelaLancamentos' )}
            />
        </View>

        <Dialog.Container visible={removerDialogVisivel}>
          <Dialog.Title>Remoção de lançamento</Dialog.Title>
          <Dialog.Description>
            Tem certeza que deseja remover este lançamento?
          </Dialog.Description>
            <Dialog.Button label="Remover" onPress={removerOnPress} />
            <Dialog.Button label="Cancelar" onPress={() => setRemoverDialogVisivel( false )} />                  
        </Dialog.Container>
      </ScrollViewUI>
    );
    
  }
  
  const styles = StyleSheet.create({      
          
  });
  
  export default DetalhesLancamento;
  