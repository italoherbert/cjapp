import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 
import { useIsFocused } from '@react-navigation/native';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import globalStyle from '../../shared/style/global-style';

import {Devedor} from '../../core/persistence/model/devedor';
import { persistence } from '../../core/persistence/persistence';
import { Picker } from '@react-native-picker/picker';
import SnackbarUI from '../../shared/ui/SnackbarUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import { faList } from '@fortawesome/free-solid-svg-icons';
import ButtonClickUI from '../../shared/ui/ButtonClickUI';
import TextInputUI from '../../shared/ui/TextInputUI';
import SelectOptionUI from '../../shared/ui/SelectOptionUI';

const SalvaDevedor = ( { navigation, route  } : NativeStackScreenProps<StackParamsList, 'SalvaDevedor'> ): React.JSX.Element => {
    
    const [nome, setNome] = useState<string>(''); 
    const [valor, setValor] = useState<string>('');
    const [tempo, setTempo] = useState<string>('novo'); 
    const isFocused = useIsFocused();

    const loadTela = useCallback( async () => {
      if ( route.params.id > 0 ) {
        let devedor : Devedor = await persistence.devedorService.getDevedorPorId( route.params.id );
        setNome( devedor.nome );
        setValor( devedor.valor.toString().replaceAll( ',', '.' ) );        
        setTempo( devedor.antigo == true ? 'antigo' : 'novo' );
      }
    }, [route.params.id] );

    useEffect( () => {
      if ( isFocused )
        loadTela();
    }, [ isFocused ] );

    const salvarOnPress = async () => {  
      let val = valor.replaceAll( ',', '.' );
      if ( isNaN( parseFloat( val ) ) === true ) {
        SnackbarUI.showDanger( 'Valor em formato inválido. Ex. valido= 45,92 ou 40 ou 43,8' );
        return;
      }

      try {
        let devedor : Devedor;
        if ( route.params.id > 0 ) {
          devedor = await persistence.devedorService.getDevedorPorId( route.params.id );
        } else {
          devedor = new Devedor();
        }

        devedor.nome = nome;
        devedor.dataDebito = new Date();
        devedor.valor = parseFloat( val );
        devedor.antigo = ( tempo === 'novo' ? false : true );

        await persistence.devedorService.salvaDevedor( devedor );

        navigation.navigate( 'DetalhesDevedor', { id : devedor.id } );
      } catch ( error : any ) {
        SnackbarUI.showDanger( ''+error.message );
      }
    };
  
    return (
      <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={globalStyle.mainScroll}>
        <View>
          <ButtonIconUI
              label='Devedores'
              icon={faList}
              flex={1}
              onPress={() => navigation.navigate( 'TelaDevedores' )}
          />

          <View style={[globalStyle.titlePanel, {marginTop: 10}]}>
              <Text style={globalStyle.title}>
                Salvar devedor
              </Text>
          </View>
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

          <SelectOptionUI
              selectedValue={tempo}
              setValue={setTempo}
              itens={[
                { label: 'Novo', value: 'novo'},
                { label: 'Antigo', value: 'antigo' }
              ]}
          />

          <ButtonClickUI
              label='Salvar'
              onPress={salvarOnPress}
          />            
                    
        </View>
      </ScrollView>
    );
    
  }
  
  const styles = StyleSheet.create({      
          
  });
  
  export default SalvaDevedor;
  