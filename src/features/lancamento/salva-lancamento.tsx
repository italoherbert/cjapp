import React, { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';

import { faList } from '@fortawesome/free-solid-svg-icons';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 
import { useIsFocused } from '@react-navigation/native';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import DateUI from '../../shared/ui/DateUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import ButtonClickUI from '../../shared/ui/ButtonClickUI';
import TextInputUI from '../../shared/ui/TextInputUI';
import PickerUI from '../../shared/ui/PickerUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';

import * as numberUtil from '../../core/util/number-util';

import * as lancamentoService from '../../core/persistence/service/lancamento-service';
import * as lancamentosGrupoService from '../../core/persistence/service/lancamentos-grupo-service';

import {Lancamento} from '../../core/persistence/model/lancamento';
import { handleError } from '../../shared/error/error-handler';
import { MessageError } from '../../core/error/MessageError';

const SalvaLancamento = ( { navigation, route  } : NativeStackScreenProps<StackParamsList, 'SalvaLancamento'> ): React.JSX.Element => {
    
    const [descricao, setDescricao] = useState<string>(''); 
    const [valor, setValor] = useState<string>(''); 
    const [dataLanc, setDataLanc] = useState<Date>(new Date());
    const [tipo, setTipo] = useState<string>('debito');     
    const [dinheiroTipo, setDinheiroTipo] = useState<string>('especie'); // especie ou conta
    const [deOndeTipo, setDeOndeTipo] = useState<string>('do-jogo');
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const loadTela = async () => {
      if ( route.params.id > 0 ) {
        try {
          let lancamento = await lancamentoService.getLancamentoPorId( db, route.params.id );

          setDescricao( lancamento.descricao );
          setValor( numberUtil.numberToStringComPonto( lancamento.valor ) );
          setDataLanc( new Date( lancamento.dataLanc ) );
          setTipo( lancamento.tipo );

          setDinheiroTipo( lancamento.emContaCorrente == true ? 'conta' : 'especie' );
          setDeOndeTipo( lancamento.doJogo == true ? 'do-jogo' : 'outro' );
        } catch ( error : any ) {
          handleError( error );
        }
      } else {
        setDescricao( '' );
        setValor( '' );
        setDataLanc( new Date() );
        setTipo( 'debito' );
        setDinheiroTipo( 'especie' );
        setDeOndeTipo( 'do-jogo' );
      }
    };

    useEffect( () => {
      if ( isFocused )
        loadTela();
    }, [ isFocused ] );

    const salvarOnPress = async () => {  
      try {
        if ( numberUtil.isNumber( valor ) === false )
          throw new MessageError( 'Valor em formato inválido.' );              

        let lancamento : Lancamento;
        if ( route.params.id > 0 ) {
          lancamento = await lancamentoService.getLancamentoPorId( db, route.params.id );
        } else {
          lancamento = new Lancamento();
          lancamento.id = 0;
        }

        lancamento.dataLanc = dataLanc;
        lancamento.descricao = descricao;
        lancamento.valor = numberUtil.stringToNumber( valor ); 
        lancamento.tipo = tipo;
        lancamento.emContaCorrente = dinheiroTipo === 'conta';
        lancamento.doJogo = deOndeTipo === 'do-jogo';

        let grupo = await lancamentosGrupoService.getGrupoAberto( db );
        if ( grupo === null )
          throw new MessageError( 'Nenhum grupo de lançamentos aberto.' );           

        lancamento.lancamentosGrupoId = grupo.id;

        await lancamentoService.salvaLancamento( db, lancamento );

        navigation.navigate( 'DetalhesLancamento', { id : lancamento.id } );
      } catch ( error ) {
        handleError( error );
      }
    };
  
    return (
      <ScrollViewUI>
          <ButtonIconUI 
              label='Lançamentos'
              icon={faList}
              flex={1}
              onPress={() => navigation.navigate( 'TelaLancamentos' )}
          />

          <TitleUI title='Salvar lançamento' />

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

          <PickerUI 
              selectedValue={tipo}
              setValue={setTipo}>
            <PickerUI.Item label='Débito' value='debito' />
            <PickerUI.Item label='Crédito' value='credito' />
          </PickerUI>

          <PickerUI 
              selectedValue={dinheiroTipo}
              setValue={setDinheiroTipo}>
            <PickerUI.Item label='Em espécie' value='especie' />
            <PickerUI.Item label='Em conta corrente' value='conta' />              
          </PickerUI>

          <PickerUI 
              selectedValue={deOndeTipo}
              setValue={setDeOndeTipo}>
            <PickerUI.Item label='Do Jogo' value='do-jogo' />
            <PickerUI.Item label='Outro' value='outro' />              
          </PickerUI>

          <ButtonClickUI
              label='Salvar'
              onPress={salvarOnPress}
          />                       
      </ScrollViewUI>
    );
    
  }
    
  export default SalvaLancamento;
  