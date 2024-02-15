import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';

import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons/faArrowAltCircleLeft';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import DateUI from '../../shared/ui/DateUI';
import FiltraLancamentosUI from '../../shared/components/filtra-lancamentos-ui';
import SnackbarUI from '../../shared/ui/SnackbarUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import ButtonClickUI from '../../shared/ui/ButtonClickUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';

import * as lancamentoService from '../../core/persistence/service/lancamento-service';
import { Lancamento } from '../../core/persistence/model/lancamento';

function FiltraLancamentos({ navigation } : NativeStackScreenProps<StackParamsList, 'FiltraLancamentos'> ): React.JSX.Element {
    
    const [dataIni, setDataIni] = useState<Date>(new Date());
    const [dataFim, setDataFim] = useState<Date>(new Date());
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
    const db = useSQLiteContext();

    const filtra = async () => {  
        try {      
            let lancs = await lancamentoService.filtraPorIntervaloIgnoreTime( db, dataIni, dataFim );      
            setLancamentos( lancs );

            if ( lancs.length === 0 )
                SnackbarUI.showInfo( 'Nenhum lancamento encontrado.' );
        } catch ( error : any ) {
            SnackbarUI.showDanger( error.message );
        }
    };
            
    return (
      <ScrollViewUI>                   
        
        <ButtonIconUI 
            label='Voltar'
            icon={faArrowAltCircleLeft}
            flex={1}
            onPress={() => navigation.goBack() }
        />                        

        <DateUI date={dataIni} setDate={setDataIni} rotulo="inicial" />
        <DateUI date={dataFim} setDate={setDataFim} rotulo="final" />

        <ButtonClickUI label='Filtrar' onPress={filtra} />
        
        <FiltraLancamentosUI 
            lancamentos={ lancamentos } 
            navigateToSaveLancamentos={ () => navigation.navigate( 'SalvaLancamento', { id : -1 }) }
            navigateToDetalhesLancamentos={ (id : number) => navigation.navigate( 'DetalhesLancamento', { id : id } ) }
        />           
      </ScrollViewUI>
    );
    
  }
    
  export default FiltraLancamentos;
  