import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
    Alert,
  Button,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import globalStyle from '../../shared/style/global-style';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import { persistence } from '../../core/persistence/persistence';
import { Lancamento } from '../../core/persistence/model/lancamento';

import DateUI from '../../shared/ui/DateUI';
import FiltraLancamentosUI from '../../shared/components/filtra-lancamentos-ui';
import SnackbarUI from '../../shared/ui/SnackbarUI';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import { faBackward, faFilter } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons/faArrowAltCircleLeft';
import ButtonClickUI from '../../shared/ui/ButtonClickUI';

function FiltraLancamentos({ navigation } : NativeStackScreenProps<StackParamsList, 'FiltraLancamentos'> ): React.JSX.Element {
    
    const [dataIni, setDataIni] = useState<Date>(new Date());
    const [dataFim, setDataFim] = useState<Date>(new Date());
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
   
    const filtra = async () => {  
        try {      
            let lancs = await persistence.lancamentoService.filtraPorIntervaloIgnoreTime( dataIni, dataFim );      
            setLancamentos( lancs );

            if ( lancs.length === 0 )
                SnackbarUI.showInfo( 'Nenhum lancamento encontrado.' );
        } catch ( error : any ) {
            Alert.alert( error.message );
        }
    };
            
    return (
      <ScrollView            
            contentInsetAdjustmentBehavior="automatic"
            style={globalStyle.mainScroll}>                   
        
        <ButtonIconUI 
            label='Voltar'
            icon={faArrowAltCircleLeft}
            flex={1}
            onPress={() => navigation.goBack() }
        />                        

        <View style={{marginVertical: 5 }}>
            <DateUI date={dataIni} setDate={setDataIni} rotulo="inicial" />
        </View>
        <View style={{marginVertical: 5 }}>
            <DateUI date={dataFim} setDate={setDataFim} rotulo="final" />
        </View>       

        <ButtonClickUI label='Filtrar' onPress={filtra} />
        
        <FiltraLancamentosUI 
            lancamentos={ lancamentos } 
            navigateToSaveLancamentos={ () => navigation.navigate( 'SalvaLancamento', { id : -1 }) }
            navigateToDetalhesLancamentos={ (id : number) => navigation.navigate( 'DetalhesLancamento', { id : id } ) }
        />           
      </ScrollView>
    );
    
  }
  
  const styles = StyleSheet.create({         
        
  });
  
  export default FiltraLancamentos;
  