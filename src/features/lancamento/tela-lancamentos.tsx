import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import globalStyle from '../../core/style/global-style';

import { StackParamsList } from '../../shared/StackParamsList';

import { persistence } from '../../core/persistence/persistence';
import FiltraLancamentosUI from '../../shared/lancamento/filtra-lancamentos-ui';
import { Lancamento } from '../../core/persistence/model/lancamento';
import { useIsFocused } from '@react-navigation/native';

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
        
        <View style={globalStyle.buttonPanel}>
            <Button 
              title="Novo lançamento" 
              color={globalStyle.buttonPrimary.color} 
              onPress={() => navigation.navigate( 'SalvaLancamento', { id : -1 } ) } /> 
        </View> 

        <View style={globalStyle.buttonPanel}>
            <Button 
              title="Filtrar lançamentos" 
              color={globalStyle.buttonPrimary.color} 
              onPress={() => navigation.navigate( 'FiltraLancamentos', { id : -1 } ) } /> 
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
  