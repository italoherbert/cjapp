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
      <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={globalStyle.mainScroll}>
        <View>
            <View style={globalStyle.titlePanel}>
                <Text style={globalStyle.title}>
                    Detalhes do lancamento
                </Text>
            </View>
            <View style={[globalStyle.field]}>
                <Text style={globalStyle.fieldName}>
                    Descrição: 
                </Text>
                <Text style={[globalStyle.fieldValue, globalStyle.primary]}>
                    {lancamento.descricao}
                </Text>
            </View>
            <View style={globalStyle.field}>
                <Text style={globalStyle.fieldName}>
                    Data de registro: 
                </Text>
                <Text style={[globalStyle.fieldValue, globalStyle.primary]}>
                    {converter.formatDate( lancamento.dataLanc )}
                </Text>
            </View>
            <View style={globalStyle.field}>
                <Text style={globalStyle.fieldName}>
                    Valor: 
                </Text>
                <Text style={[globalStyle.fieldValue, { color: lancamento.tipo === 'debito' ? '#F00' : '#00F'}]}>
                    {converter.formatBRL( lancamento.valor )}
                </Text>
            </View>
            <View style={globalStyle.field}>
                <Text style={globalStyle.fieldName}>
                    Tipo: 
                </Text>
                <Text style={[globalStyle.fieldValue, { color: lancamento.tipo === 'debito' ? '#F00' : '#00F'}]}>
                    {lancamento.tipo == 'debito' ? 'Débito' : 'Crédito' }
                </Text>
            </View>
            <View style={globalStyle.field}>
                <Text style={globalStyle.fieldName}>
                    Dinheiro: 
                </Text>
                <Text style={[globalStyle.fieldValue, globalStyle.success]}>
                    {lancamento.emContaCorrente == true ? 'Em conta' : 'Em espécie' }
                </Text>
            </View>
            <View style={globalStyle.field}>
                <Text style={globalStyle.fieldName}>
                    Do Jogo: 
                </Text>
                <Text style={[globalStyle.fieldValue, globalStyle.success]}>
                    {lancamento.doJogo == true ? 'Sim' : 'Não' }
                </Text>
            </View>
            { removido === true && 
              <Text style={globalStyle.danger}>
                    Removido!
              </Text>
            }

            { removido === false && 
              <View>
                <View style={globalStyle.buttonPanel}>             
                    <Button
                        color={globalStyle.buttonPrimary.color}
                        title='Remover'
                        onPress={() => setRemoverDialogVisivel( !removerDialogVisivel )}
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
                <View style={globalStyle.buttonPanel}>             
                    <Button
                        color={globalStyle.buttonPrimary.color}
                        title='Editar'
                        onPress={() => navigation.navigate( 'SalvaLancamento', { id: route.params.id } )}
                    />            
                </View>
              </View>
            }
            <View style={globalStyle.buttonPanel}>
                <Button
                    color={globalStyle.buttonPrimary.color}
                    title='Listar lancamentos'
                    onPress={() => navigation.navigate( 'TelaLancamentos' )}
                />
            </View>
        </View>
      </ScrollView>
    );
    
  }
  
  const styles = StyleSheet.create({      
          
  });
  
  export default DetalhesLancamento;
  