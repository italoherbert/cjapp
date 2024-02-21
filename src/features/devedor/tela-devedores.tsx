import React, { useEffect, useState } from 'react';
import {
  Pressable,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite/next';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamsList } from '../../shared/screens/StackParamsList';

import SelectBoxUI from '../../shared/ui/SelectBoxUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import TextInputUI from '../../shared/ui/TextInputUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';
import ViewUI from '../../shared/ui/ViewUI';
import TextUI from '../../shared/ui/TextUI';

import * as numberUtil from '../../core/util/number-util';

import * as devedorService from '../../core/persistence/service/devedor-service';
import {Devedor} from '../../core/persistence/model/devedor';

import { handleError } from '../../shared/error/error-handler';

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
        handleError( error );
      }
    };

    const carregaDevedores = async () => {
      let nmLike = nomeLike.trim().length === 0 ? '*' : nomeLike;
      
      try {
        let data = await devedorService.filtraDevedores( db, nmLike, antigo );
        setDevedores( data ); 
      } catch ( error : any ) {
        handleError( error );
      }
    };

    const novoSelectOnPress = async ( isChecked : boolean ) => {
      setAntigo( false );

      let nmLike = nomeLike.trim().length === 0 ? '*' : nomeLike;
      
      try {
        let data = await devedorService.filtraDevedores( db, nmLike, false );
        setDevedores( data );
      } catch ( error : any ) {
        handleError( error );
      }
    };

    const antigoSelectOnPress = async ( isChecked : boolean ) => {
      setAntigo( true );

      let nmLike = nomeLike.trim().length === 0 ? '*' : nomeLike;

      try {
        let data = await devedorService.filtraDevedores( db, nmLike, true );
        setDevedores( data );
      } catch ( error : any ) {
        handleError( error );
      }
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
        
        <ViewUI background='light' marginBottom={20}>
            {devedores.map( (devedor: Devedor, index) => 
                <Pressable key={index}
                    onPress={ () => navigation.navigate( 'DetalhesDevedor', { id: devedor.id } ) }
                >
                  <ViewUI isRow={true} 
                      justifyContent='space-between' 
                      border='light-x'
                      padding={12}>
                        <TextUI variant='dark-x'>{devedor.nome}</TextUI>
                        <TextUI variant='danger'>
                            {numberUtil.formatBRL( devedor.valor )}
                        </TextUI>
                  </ViewUI>                  
                </Pressable>
            ) }           
        </ViewUI>        
      </ScrollViewUI>
    );
    
  }
  
  export default TelaDevedores;
  