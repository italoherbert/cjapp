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

import {Picker} from '@react-native-picker/picker';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import globalStyle from '../../shared/style/global-style';

import { persistence } from '../../core/persistence/persistence';
import {Lancamento} from '../../core/persistence/model/lancamento';
import DateUI from '../../shared/ui/DateUI';
import SnackbarUI from '../../shared/ui/SnackbarUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import { faList } from '@fortawesome/free-solid-svg-icons';
import ButtonClickUI from '../../shared/ui/ButtonClickUI';
import TextInputUI from '../../shared/ui/TextInputUI';
import DatePickerUI from '../../shared/ui/SelectOptionUI';
import SelectOptionUI from '../../shared/ui/SelectOptionUI';

const SalvaLancamento = ( { navigation, route  } : NativeStackScreenProps<StackParamsList, 'SalvaLancamento'> ): React.JSX.Element => {
    
    const [descricao, setDescricao] = useState<string>(''); 
    const [valor, setValor] = useState<string>(''); 
    const [dataLanc, setDataLanc] = useState<Date>(new Date());
    const [tipo, setTipo] = useState<string>('debito');     
    const [dinheiroTipo, setDinheiroTipo] = useState<string>('especie'); // especie ou conta
    const [deOndeTipo, setDeOndeTipo] = useState<string>('do-jogo');
    const isFocused = useIsFocused();

    const loadTela = useCallback( async () => {
      if ( route.params.id > 0 ) {
        let lancamento : Lancamento = await persistence.lancamentoService.getLancamentoPorId( route.params.id );
        setDescricao( lancamento.descricao );
        setValor( lancamento.valor.toString().replaceAll( ',', '.' ) );
        setDataLanc( new Date( lancamento.dataLanc ) );
        setTipo( lancamento.tipo );

        setDinheiroTipo( lancamento.emContaCorrente == true ? 'conta' : 'especie' );
        setDeOndeTipo( lancamento.doJogo == true ? 'do-jogo' : 'outro' );
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
        let lancamento : Lancamento;
        if ( route.params.id > 0 ) {
          lancamento = await persistence.lancamentoService.getLancamentoPorId( route.params.id );
          lancamento.dataLanc = dataLanc;
        } else {
          lancamento = new Lancamento();
          lancamento.id = 0;
          lancamento.dataLanc = new Date();
        }

        lancamento.descricao = descricao;
        lancamento.valor = parseFloat( val );
        lancamento.tipo = tipo;
        lancamento.emContaCorrente = dinheiroTipo === 'conta';
        lancamento.doJogo = deOndeTipo === 'do-jogo';

        await persistence.lancamentoService.salvaLancamento( lancamento );

        navigation.navigate( 'DetalhesLancamento', { id : lancamento.id } );
      } catch ( error : any ) {
        Alert.alert( ''+error.message );
      }
    };
  
    return (
      <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={globalStyle.mainScroll}>
        <View>

          <ButtonIconUI 
              label='Lançamentos'
              icon={faList}
              flex={1}
              onPress={() => navigation.navigate( 'TelaLancamentos' )}
          />

          <View style={[globalStyle.titlePanel, {marginTop: 10}]}>
              <Text style={globalStyle.title}>
                Salvar lançamento
              </Text>
          </View>

          <TextInputUI
              setValue={setDescricao}
              defaultValue={descricao}              
              placeholder='Informe a descrição'
          /> 
          
          <TextInputUI
              defaultValue={valor}
              setValue={setValor}
              placeholder="Informe o valor"           
          /> 

          <DateUI date={dataLanc} setDate={setDataLanc} rotulo="data de lançamento" />

          <SelectOptionUI 
              selectedValue={tipo}
              setValue={setTipo}
              itens={[
                { label: 'Debito', value: 'debito'},
                { label: 'Crédito', value: 'credito' }
              ]}
          />

          <SelectOptionUI 
              selectedValue={dinheiroTipo}
              setValue={setDinheiroTipo}
              itens={[
                { label: 'Em especie', value: 'especie'},
                { label: 'Em conta corrente', value: 'conta' }
              ]}
          />

          <SelectOptionUI 
              selectedValue={deOndeTipo}
              setValue={setDeOndeTipo}
              itens={[
                { label: 'Do Jogo', value: 'do-jogo'},
                { label: 'Outro', value: 'outro' }
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
  
  export default SalvaLancamento;
  