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

import { StackParamsList } from '../../shared/screens/StackParamsList';

import globalStyle from '../../shared/style/global-style';

import { persistence } from '../../core/persistence/persistence';
import * as converter from '../../core/converter/converter';

import {Devedor} from '../../core/persistence/model/devedor';
import SnackbarUI from '../../shared/ui/SnackbarUI';
  
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
      <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={globalStyle.mainScroll}>
        <View>
            <View style={globalStyle.titlePanel}>
                <Text style={globalStyle.title}>
                    Detalhes do devedor
                </Text>
            </View>
            <View style={globalStyle.field}>
                <Text style={globalStyle.fieldName}>
                    Nome: 
                </Text>
                <Text style={[globalStyle.fieldValue, globalStyle.primary]}>
                    {devedor.nome}
                </Text>
            </View>
            <View style={globalStyle.field}>
                <Text style={globalStyle.fieldName}>
                    Data débito: 
                </Text>
                <Text style={[globalStyle.fieldValue, globalStyle.primary]}>
                    {converter.formatDate( devedor.dataDebito )}
                </Text>
            </View>
            <View style={globalStyle.field}>
                <Text style={globalStyle.fieldName}>
                    Valor: 
                </Text>
                <Text style={[globalStyle.fieldValue, globalStyle.danger]}>
                    {converter.formatBRL( devedor.valor )}
                </Text>
            </View>
            <View style={globalStyle.field}>
                <Text style={globalStyle.fieldName}>
                    Tempo: 
                </Text>
                <Text style={[globalStyle.fieldValue, globalStyle.primary]}>
                    {devedor.antigo == true ? 'Antigo' : 'Novo' }
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
                    <Dialog.Title>Remoção de devedor</Dialog.Title>
                    <Dialog.Description>
                      Tem certeza que deseja remover este devedor?
                    </Dialog.Description>
                    <Dialog.Button label="Remover" onPress={removerOnPress} />
                    <Dialog.Button label="Cancelar" onPress={() => setRemoverDialogVisivel( false )} />                  
                </Dialog.Container>

                <View style={globalStyle.buttonPanel}>             
                    <Button
                        color={globalStyle.buttonPrimary.color}
                        title='Editar'
                        onPress={() => navigation.navigate( 'SalvaDevedor', { id: route.params.id } )}
                    />            
                </View>
              </View>
            }            
            <View style={globalStyle.buttonPanel}>
                <Button
                    color={globalStyle.buttonPrimary.color}
                    title='Listar devedores'
                    onPress={() => navigation.navigate( 'TelaDevedores' )}
                />
            </View>
        </View>
      </ScrollView>
    );
    
  }
  
  const styles = StyleSheet.create({      
          
  });
  
  export default DetalhesDevedor;
  