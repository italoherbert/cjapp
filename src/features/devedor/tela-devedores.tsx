import React, { useEffect, useState } from 'react';
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

import globalStyle from '../../shared/style/global-style';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import { persistence } from '../../core/persistence/persistence';
import {Devedor} from '../../core/persistence/model/devedor';
import SelectBoxUI from '../../shared/ui/SelectBoxUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import { faPlug, faPlus } from '@fortawesome/free-solid-svg-icons';
import TextInputUI from '../../shared/ui/TextInputUI';

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

        <ButtonIconUI 
            label='Novo devedor'
            icon={faPlus}
            flex={1}
            onPress={() => navigation.navigate( 'SalvaDevedor', { id : -1 } ) }
        />

        <View style={[globalStyle.titlePanel, {marginTop: 10}]}>
            <Text style={globalStyle.title}>
                Lista de devedores
            </Text>
        </View> 

        <SelectBoxUI op1Rotulo="Novo"
            op1OnSelect={novoSelectOnPress} 
            op2Rotulo='Antigo' 
            op2OnSelect={antigoSelectOnPress} 
            defaultOpSelectedIndex={1} />          

        <View>
          <TextInputUI
              defaultValue={nomeLike} 
              setValue={nomeLikeOnChangeText}
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
      backgroundColor: '#E4E4E4'
    },
    listaView : {           
      flexDirection: 'row',
      justifyContent: 'space-between',

      borderWidth: 1,
      borderColor: '#EEE',

      padding: 12,

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
  