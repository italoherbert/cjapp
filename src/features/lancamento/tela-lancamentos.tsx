import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import globalStyle from '../../shared/style/global-style';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import { persistence } from '../../core/persistence/persistence';
import { Lancamento } from '../../core/persistence/model/lancamento';

import FiltraLancamentosUI from '../../shared/components/filtra-lancamentos-ui';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import { faBalanceScale, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';

function TelaLancamentos({ navigation } : NativeStackScreenProps<StackParamsList, 'TelaLancamentos'> ): React.JSX.Element {
    
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
    const isFocused = useIsFocused();

    const carregaLancamentos = async () => {
      try {
        let lancs = await persistence.lancamentoService.filtraPorMes( new Date() );
        setLancamentos( lancs );
      } catch ( error : any ) {
        Alert.alert( error.message );
        throw error;
      }
    };

    useEffect( ()=> {
      if ( isFocused )
        carregaLancamentos();    
    }, [isFocused] );
                
    return (
      <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={globalStyle.mainScroll}>   

        <View style={{flexDirection: 'row', flex: 3}}>
            <ButtonIconUI 
                label='Novo'
                icon={faPlus}
                color={globalStyle.buttonPrimary.color} 
                size={14}
                style={{flex : 1}}
                onPress={() => navigation.navigate( 'SalvaLancamento', { id : -1 } )}
            />
            
            <ButtonIconUI 
                label='Filtrar'
                icon={faFilter}
                color={globalStyle.buttonPrimary.color} 
                size={14}
                style={{flex : 1}}
                marginType='both'
                onPress={ () => navigation.navigate( 'FiltraLancamentos', { id : -1 } ) }
            />

            <ButtonIconUI
                label="Ver balanço" 
                icon={faBalanceScale}
                color={globalStyle.buttonPrimary.color} 
                size={14}
                style={{flex : 1}}
                onPress={ () => navigation.navigate( 'MostraBalanco', { lancamentos : lancamentos } ) } />            
        </View>        
        
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
  
  export default TelaLancamentos;
  