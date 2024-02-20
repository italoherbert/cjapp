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
import TextUI from '../../shared/ui/TextUI';

import * as lancamentoService from '../../core/persistence/service/lancamento-service';
import * as lancamentosGrupoService from '../../core/persistence/service/lancamentos-grupo-service';

import { Lancamento } from '../../core/persistence/model/lancamento';
import { LancamentosGrupo } from '../../core/persistence/model/lancamentos-grupo';

import { handleError } from '../../shared/error/error-handler';

function TelaLancamentos({ navigation } : NativeStackScreenProps<StackParamsList, 'TelaLancamentos'> ): React.JSX.Element {
    
    const [lancamentosGrupoAberto, setLancamentosGrupoAberto] = useState<LancamentosGrupo>(new LancamentosGrupo());
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
    const [carregados, setCarregados] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const carregaLancamentos = async () => {
      try {
        let grupo = await lancamentosGrupoService.getGrupoAberto( db );
        if ( grupo !== null ) {          
          let lancs = await lancamentoService.getLancamentosPorGrupoId( db, grupo.id );

          setLancamentos( lancs );
          setLancamentosGrupoAberto( grupo );
          setCarregados( true );
        } else {
          setCarregados( false );
        }
      } catch ( error : any ) {
        handleError( error );
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

        { carregados === false &&
          <TextUI variant='primary' marginVertical={10}>
            Nenhum grupo de lançamentos aberto.
          </TextUI>
        }

        { carregados === true &&      
            <FiltraLancamentosUI 
                lancamentos={ lancamentos }
                lancamentosGrupoAberto={ lancamentosGrupoAberto } 
                navigateToSaveLancamentos={ () => navigation.navigate( 'SalvaLancamento', { id : -1 }) }
                navigateToDetalhesLancamentos={ (id : number) => navigation.navigate( 'DetalhesLancamento', { id : id } ) }
            />           
        }
      </ScrollViewUI>
    );
    
  }
    
  export default TelaLancamentos;
  