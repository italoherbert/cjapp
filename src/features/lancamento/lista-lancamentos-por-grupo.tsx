import React, { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';

import { faBalanceScale, faPlus } from '@fortawesome/free-solid-svg-icons';

import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import FiltraLancamentosUI from '../../shared/components/filtra-lancamentos-ui';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TextUI from '../../shared/ui/TextUI';
import TitleUI from '../../shared/ui/TitleUI';

import * as lancamentoService from '../../core/persistence/service/lancamento-service';
import * as lancamentosGrupoService from '../../core/persistence/service/lancamentos-grupo-service';

import { Lancamento } from '../../core/persistence/model/lancamento';
import { LancamentosGrupo } from '../../core/persistence/model/lancamentos-grupo';

import { handleError } from '../../shared/error/error-handler';

function ListaLancamentosPorGrupo({ route, navigation } : NativeStackScreenProps<StackParamsList, 'ListaLancamentosPorGrupo'> ): React.JSX.Element {
    
    const [lancamentosGrupoAberto, setLancamentosGrupoAberto] = useState<LancamentosGrupo>(new LancamentosGrupo());
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
    const [carregados, setCarregados] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const carregaLancamentos = async () => {
      try {        
        let gid = route.params.gid;
        let grupo = await lancamentosGrupoService.getGrupoPorId( db, gid );        

        if ( grupo !== null ) {          
          let lancs = await lancamentoService.getLancamentosPorGrupoId( db, grupo.id );

          setLancamentos( lancs );
          setLancamentosGrupoAberto( grupo );
          setCarregados( true );
        } else {
          setCarregados( false );
        }
      } catch ( error ) {
        handleError( error );
      }
    };

    useEffect( ()=> {
      if ( isFocused )
        carregaLancamentos();    
    }, [isFocused] );
                
    return (
      <ScrollViewUI>   

        <ButtonIconUI
            label="Ver balanço" 
            icon={faBalanceScale}
            flex={1}
            onPress={ () => navigation.navigate( 'MostraBalanco', { lancamentos : lancamentos } ) } />            

        <TitleUI title='Lancs. do grupo' />

        { carregados === false &&
          <TextUI variant='primary' marginVertical={10}>
            Lançamentos não carregados pelo ID do grupo.
          </TextUI>
        }

        { carregados === true &&      
            <FiltraLancamentosUI 
                lancamentos={ lancamentos }
                lancamentosGrupoAberto={ lancamentosGrupoAberto } 
                navigateToSaveLancamentos={ () => navigation.navigate( 'SalvaLancamento', { id : -1 }) }
                navigateToDetalhesLancamentos={ (id : number) => navigation.navigate( 'DetalhesLancamento', { id : id } ) }
                navitateToMostraBalanco={ ( lancs : Lancamento[] ) => navigation.navigate( 'MostraBalanco', { lancamentos : lancs })}
            />           
        }
      </ScrollViewUI>
    );
    
  }
    
  export default ListaLancamentosPorGrupo;
  