import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite/next';

import { faPlus } from '@fortawesome/free-solid-svg-icons';


import { StackParamsList } from '../../shared/screens/StackParamsList';

import {Devedor} from '../../core/persistence/model/devedor';
import SelectBoxUI from '../../shared/ui/SelectBoxUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import TextInputUI from '../../shared/ui/TextInputUI';
import SnackbarUI from '../../shared/ui/SnackbarUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';
import ViewUI from '../../shared/ui/ViewUI';
import TextUI from '../../shared/ui/TextUI';

import * as formatter from '../../core/converter/converter';
import * as devedorService from '../../core/persistence/service/devedor-service';

function TelaDevedores({ navigation } : NativeStackScreenProps<StackParamsList, 'TelaDevedores'> ): React.JSX.Element {

    const [devedores, setDevedores] = useState<Devedor[]>([]);
    const [nomeLike, setNomeLike] = useState<string>('');
    const [antigo, setAntigo] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const nomeLikeOnChangeText = async ( text : string ) => {      
      setNomeLike( text );

      let nmLike = text.trim().length === 0 ? '*' : text;

      try {
        let data = await devedorService.filtraDevedores( db, nmLike, antigo );
        setDevedores( data );       
      } catch ( error : any ) {
        SnackbarUI.showDanger( ''+error.message );
      }
    };

    const carregaDevedores = async () => {
      let nmLike = nomeLike.trim().length === 0 ? '*' : nomeLike;
      
      try {
        let data = await devedorService.filtraDevedores( db, nmLike, antigo );
        setDevedores( data ); 
      } catch ( error : any ) {
        SnackbarUI.showDanger( ''+error.message );
      }
    };

    const novoSelectOnPress = async ( isChecked : boolean ) => {
      setAntigo( false );

      let nmLike = nomeLike.trim().length === 0 ? '*' : nomeLike;
      
      try {
      let data = await devedorService.filtraDevedores( db, nmLike, false );
      setDevedores( data );
      } catch ( error : any ) {
        SnackbarUI.showDanger( ''+error );
      }
    };

    const antigoSelectOnPress = async ( isChecked : boolean ) => {
      setAntigo( true );

      let nmLike = nomeLike.trim().length === 0 ? '*' : nomeLike;
      
      let data = await devedorService.filtraDevedores( db, nmLike, true );
      setDevedores( data );
    };

    useEffect( () => {
      if ( isFocused )
        carregaDevedores();
    }, [isFocused] );
  
    return (
      <ScrollViewUI>        

        <ButtonIconUI 
            label='Novo devedor'
            icon={faPlus}
            flex={1}
            onPress={() => navigation.navigate( 'SalvaDevedor', { id : -1 } ) }
        />

        <TitleUI title='Lista de devedores' />

        <SelectBoxUI op1Rotulo="Novos"
            op1OnSelect={novoSelectOnPress} 
            op2Rotulo='Antigos' 
            op2OnSelect={antigoSelectOnPress} 
            defaultOpSelectedIndex={1} />          

        <TextInputUI
            defaultValue={nomeLike} 
            setValue={nomeLikeOnChangeText}
            placeholder='Informe o nome' />
        
        <ViewUI background='light'>
            {devedores.map( (devedor: Devedor, index) => { 
            return (
                <Pressable key={index}
                    onPress={ () => navigation.navigate( 'DetalhesDevedor', { id: devedor.id } ) }
                >
                  <ViewUI isRow={true} 
                      justifyContent='space-between' 
                      border='light-x'
                      padding={12}>
                        <TextUI variant='dark-x'>{devedor.nome}</TextUI>
                        <TextUI variant='danger'>
                            {formatter.formatBRL( devedor.valor )}
                        </TextUI>
                  </ViewUI>                  
                </Pressable>
            )
            } )}          
        </ViewUI>        
      </ScrollViewUI>
    );
    
  }
  
  export default TelaDevedores;
  