import React, { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';

import { faEdit, faList, faPlus, faX } from '@fortawesome/free-solid-svg-icons';

import Dialog from 'react-native-dialog';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 
import { useIsFocused } from '@react-navigation/native';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import SnackbarUI from '../../shared/ui/SnackbarUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';
import SimpleFieldUI from '../../shared/ui/SimpleFieldUI';
import TextUI from '../../shared/ui/TextUI';
import ViewUI from '../../shared/ui/ViewUI';

import * as converter from '../../core/converter/converter';
import * as lancamentoService from '../../core/persistence/service/lancamento-service';

import {Lancamento} from '../../core/persistence/model/lancamento';
import { handleError } from '../../shared/error/error-handler';
import { MessageError } from '../../core/error/MessageError';

const DetalhesLancamento = ( { navigation, route  } : NativeStackScreenProps<StackParamsList, 'DetalhesLancamento'> ): React.JSX.Element => {
    
    const [lancamento, setLancamento] = useState<Lancamento>(new Lancamento()); 
    const [removerDialogVisivel, setRemoverDialogVisivel] = useState<boolean>(false);
    const [removido, setRemovido] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const loadTela = async () => {
      if ( route.params.id > 0 ) {
        try {
          let lancamento = await lancamentoService.getLancamentoPorId( db, route.params.id );
          setLancamento( lancamento );
        } catch ( error : any ) {
          handleError( error );
        }
      }
    };

    useEffect( () => {
      if ( isFocused )
        loadTela();
    }, [ isFocused ] );

    const removerOnPress = async () => {      
      setRemoverDialogVisivel( false );

      try {
        let id = route.params.id;
        if ( id <= 0 )
          throw new MessageError( 'Nenhum lancamento selecionado para remoção.' );
        
        await lancamentoService.deletaLancamentoPorId( db, id );
        setRemovido( true );

        SnackbarUI.showInfo( 'Lancamento removido com sucesso.' );
      } catch ( error : any ) {
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

        <TitleUI title='Detalhes do Lançamento' />

        <SimpleFieldUI>
          <TextUI>Descrição</TextUI>
          <TextUI>{lancamento.descricao}</TextUI>
        </SimpleFieldUI>

        <SimpleFieldUI>
          <TextUI>Data de registro</TextUI>
          <TextUI>
            {converter.formatDate( lancamento.dataLanc )}
          </TextUI>
        </SimpleFieldUI>

        <SimpleFieldUI>
          <TextUI>Valor</TextUI>
          <TextUI variant={ lancamento.tipo === 'debito' ? 'danger' : 'primary' }>
            {converter.formatBRL( lancamento.valor )}
          </TextUI>
        </SimpleFieldUI>

        <SimpleFieldUI>
          <TextUI>Tipo</TextUI>
          <TextUI variant={ lancamento.tipo === 'debito' ? 'danger' : 'primary' }>
            {lancamento.tipo == 'debito' ? 'Débito' : 'Crédito' }
          </TextUI>
        </SimpleFieldUI>

        <SimpleFieldUI>
          <TextUI>Dinheiro</TextUI>
          <TextUI variant='success'>
            {lancamento.emContaCorrente == true ? 'Em conta' : 'Em espécie' }
          </TextUI>
        </SimpleFieldUI>

        <SimpleFieldUI>
          <TextUI>Do jogo</TextUI>
          <TextUI variant='success'>
            {lancamento.doJogo == true ? 'Sim' : 'Não' }
          </TextUI>
        </SimpleFieldUI>
            
        { removido === true && 
          <TextUI variant='danger' marginVertical={10}>
                Removido!
          </TextUI>
        }

        <ViewUI isRow={true} marginVertical={10}>                                     
            <ButtonIconUI 
                label='Novo'
                icon={faPlus}
                flex={1}
                onPress={() => navigation.navigate( 'SalvaLancamento', { id : -1 } )}
            />

            <ButtonIconUI 
                label='Editar'
                icon={faEdit}
                flex={1}
                marginType='both'
                disable={removido}
                onPress={() => navigation.navigate( 'SalvaLancamento', { id: route.params.id } )}
            />

            <ButtonIconUI 
                label='Remover'
                icon={faX}
                flex={1}
                variant='danger' 
                disable={removido}                     
                onPress={() => setRemoverDialogVisivel( !removerDialogVisivel )}
            />                                   
        </ViewUI>

        <Dialog.Container visible={removerDialogVisivel}>
          <Dialog.Title>Remoção de lançamento</Dialog.Title>
          <Dialog.Description>
            Tem certeza que deseja remover este lançamento?
          </Dialog.Description>
            <Dialog.Button label="Remover" onPress={removerOnPress} />
            <Dialog.Button label="Cancelar" onPress={() => setRemoverDialogVisivel( false )} />                  
        </Dialog.Container>
      </ScrollViewUI>
    );
    
  }
  
  export default DetalhesLancamento;
  