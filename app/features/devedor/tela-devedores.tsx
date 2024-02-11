import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';

import * as formatter from '../../core/converter/converter';

import globalStyle from '../../core/style/global-style';

import { StackParamsList } from '../../shared/StackParamsList';

import { persistence } from '../../core/persistence/persistence';
import {Devedor} from '../../core/persistence/model/devedor';
import SelectBoxUI from '../../shared/ui/SelectBoxUI';

function TelaDevedores({ navigation } : NativeStackScreenProps<StackParamsList, 'TelaDevedores'> ): React.JSX.Element {

    const [devedores, setDevedores] = useState<Devedor[]>([]);
    const [nomeLike, setNomeLike] = useState<string>('');
    const [antigo, setAntigo] = useState<boolean>(false);
    const isFocused = useIsFocused();

    const nomeLikeOnChangeText = async ( text : string ) => {      
      setNomeLike( text );

      let nmLike = text.trim().length === 0 ? '*' : text;
      
      let data = await persistence.devedorService.filtraDevedores( nmLike, antigo );
      setDevedores( data );       
    };

    const carregaDevedores = async () => {
      let nmLike = nomeLike.trim().length === 0 ? '*' : nomeLike;
      
      let data = await persistence.devedorService.filtraDevedores( nmLike, antigo );
      setDevedores( data ); 
    };

    const novoSelectOnPress = async ( isChecked : boolean ) => {
      setAntigo( false );

      let nmLike = nomeLike.trim().length === 0 ? '*' : nomeLike;
      
      let data = await persistence.devedorService.filtraDevedores( nmLike, false );
      setDevedores( data );
    };

    const antigoSelectOnPress = async ( isChecked : boolean ) => {
      setAntigo( true );

      let nmLike = nomeLike.trim().length === 0 ? '*' : nomeLike;
      
      let data = await persistence.devedorService.filtraDevedores( nmLike, true );
      setDevedores( data );
    };

    useEffect( () => {
      if ( isFocused )
        carregaDevedores();
    }, [isFocused] );
  
    return (
      <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={globalStyle.mainScroll}>

        <View style={globalStyle.buttonPanel}>
            <Button 
              title="Novo devedor" 
              color={globalStyle.buttonPrimary.color} 
              onPress={() => navigation.navigate( 'SalvaDevedor', { id : -1 } ) } /> 
        </View>

        <View style={[globalStyle.titlePanel, {marginTop: 10}]}>
            <Text style={globalStyle.title}>
                Lista de devedores
            </Text>
        </View>    
        <View style={globalStyle.lineLayout}>
          <SelectBoxUI op1Rotulo="Novo"
              op1OnSelect={novoSelectOnPress} 
              op2Rotulo='Antigo' 
              op2OnSelect={antigoSelectOnPress} 
              defaultOpSelectedIndex={1} />          
        </View>
        <View>
          <TextInput style={globalStyle.textInput}
              defaultValue={nomeLike} 
              onChangeText={nomeLikeOnChangeText}
              placeholder='Informe o nome' />
        </View>
        <View style={styles.listaPanel}>
            {devedores.map( (devedor: Devedor, index) => { 
            return (
                <Pressable key={index}
                    onPress={ () => navigation.navigate( 'DetalhesDevedor', { id: devedor.id } ) }
                >
                  <View style={styles.listaView}>
                    <Text style={styles.listaItem} >{devedor.nome}</Text>
                    <Text style={[styles.listaItem, styles.valor]}>
                      {formatter.formatBRL( devedor.valor )}
                    </Text>
                  </View>
                </Pressable>
            )
            } )}          
        </View>        
      </ScrollView>
    );
    
  }
  
  const styles = StyleSheet.create({         
    listaPanel : {
      
    },
    listaView : {           
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',

      padding: 8,

      borderWidth: 1,
      borderColor: '#DDD', 

      backgroundColor: '#EEE',
    },
    listaItem: {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#000'
    },
    valor: {
      color: '#F00'
    }
  });
  
  export default TelaDevedores;
  