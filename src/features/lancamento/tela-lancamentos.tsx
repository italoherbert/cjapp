import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';

import { faBalanceScale, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';

import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import FiltraLancamentosUI from '../../shared/components/filtra-lancamentos-ui';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import ViewUI from '../../shared/ui/ViewUI';

import * as lancamentoService from '../../core/persistence/service/lancamento-service';
import { Lancamento } from '../../core/persistence/model/lancamento';
import SnackbarUI from '../../shared/ui/SnackbarUI';

function TelaLancamentos({ navigation } : NativeStackScreenProps<StackParamsList, 'TelaLancamentos'> ): React.JSX.Element {
    
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const carregaLancamentos = async () => {
      try {
        let lancs = await lancamentoService.filtraPorMes( db, new Date() );
        setLancamentos( lancs );
      } catch ( error : any ) {
        SnackbarUI.showDanger( error.message );
      }
    };

    useEffect( ()=> {
      if ( isFocused )
        carregaLancamentos();    
    }, [isFocused] );
                
    return (
      <ScrollViewUI>   

        <ViewUI flex={3} isRow={true}>
            <ButtonIconUI 
                label='Novo'
                icon={faPlus}
                flex={1}
                onPress={() => navigation.navigate( 'SalvaLancamento', { id : -1 } )}
            />
            
            <ButtonIconUI 
                label='Filtrar'
                icon={faFilter}
                flex={1}
                marginType='both'
                onPress={ () => navigation.navigate( 'FiltraLancamentos', { id : -1 } ) }
            />

            <ButtonIconUI
                label="Ver balanço" 
                icon={faBalanceScale}
                flex={1}
                onPress={ () => navigation.navigate( 'MostraBalanco', { lancamentos : lancamentos } ) } />            
        </ViewUI>        
        
        <FiltraLancamentosUI 
            lancamentos={ lancamentos } 
            navigateToSaveLancamentos={ () => navigation.navigate( 'SalvaLancamento', { id : -1 }) }
            navigateToDetalhesLancamentos={ (id : number) => navigation.navigate( 'DetalhesLancamento', { id : id } ) }
        />           
      </ScrollViewUI>
    );
    
  }
    
  export default TelaLancamentos;
  