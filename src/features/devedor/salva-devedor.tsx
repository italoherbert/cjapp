import React, { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';


import { NativeStackScreenProps } from '@react-navigation/native-stack'; 
import { useIsFocused } from '@react-navigation/native';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import { faList } from '@fortawesome/free-solid-svg-icons';

import SnackbarUI from '../../shared/ui/SnackbarUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import ButtonClickUI from '../../shared/ui/ButtonClickUI';
import TextInputUI from '../../shared/ui/TextInputUI';
import PickerUI from '../../shared/ui/PickerUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';

import * as devedorService from '../../core/persistence/service/devedor-service';
import {Devedor} from '../../core/persistence/model/devedor';

import { MessageError } from '../../core/error/MessageError';
import { handleError } from '../../shared/error/error-handler';


const SalvaDevedor = ( { navigation, route  } : NativeStackScreenProps<StackParamsList, 'SalvaDevedor'> ): React.JSX.Element => {
    
    const [nome, setNome] = useState<string>(''); 
    const [valor, setValor] = useState<string>('');
    const [tempo, setTempo] = useState<string>('novo'); 
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const loadTela = useCallback( async () => {
      if ( route.params.id > 0 ) {
        try {
        let devedor : Devedor = await devedorService.getDevedorPorId( db, route.params.id );
        setNome( devedor.nome );
        setValor( devedor.valor.toString().replaceAll( ',', '.' ) );        
        setTempo( devedor.antigo == true ? 'antigo' : 'novo' );
        } catch ( error : any ) {
          handleError( error );
        }
      }
    }, [route.params.id] );

    useEffect( () => {
      if ( isFocused )
        loadTela();
    }, [ isFocused ] );

    const salvarOnPress = async () => {  
      let val = valor.replaceAll( ',', '.' );
      if ( isNaN( parseFloat( val ) ) === true )
        throw new MessageError( 'Valor em formato inválido. Ex. valido= 45,92 ou 40 ou 43,8' );      

      try {
        let devedor : Devedor;
        if ( route.params.id > 0 ) {
          devedor = await devedorService.getDevedorPorId( db, route.params.id );
        } else {
          devedor = new Devedor();
        }

        devedor.nome = nome;
        devedor.dataDebito = new Date();
        devedor.valor = parseFloat( val );
        devedor.antigo = ( tempo === 'novo' ? false : true );

        await devedorService.salvaDevedor( db, devedor );

        navigation.navigate( 'DetalhesDevedor', { id : devedor.id } );
      } catch ( error : any ) {
        handleError( error );
      }
    };
  
    return (
      <ScrollViewUI>
          <ButtonIconUI
              label='Devedores'
              icon={faList}
              flex={1}
              onPress={() => navigation.navigate( 'TelaDevedores' )}
          />

          <TitleUI title='Salvar devedor' marginTop={10} />

          <TextInputUI
              setValue={setNome}
              defaultValue={nome}              
              placeholder='Informe o nome'
          /> 
          <TextInputUI
              setValue={setValor}
              defaultValue={valor}
              placeholder="Informe o valor"           
          /> 

          <PickerUI
              selectedValue={tempo}
              setValue={setTempo}>
                <PickerUI.Item label='Novo' value='novo' />
                <PickerUI.Item label='Antigo' value='antigo' />
          </PickerUI>
             
          <ButtonClickUI
              label='Salvar'
              onPress={salvarOnPress}
          />                                
      </ScrollViewUI>
    );
    
  }
    
  export default SalvaDevedor;
  