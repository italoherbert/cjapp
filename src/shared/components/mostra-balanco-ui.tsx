import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import * as converter from '../../core/converter/converter';
import { persistence } from '../../core/persistence/persistence';

import globalStyle from '../style/global-style';

import * as lancamentoLogica from '../../core/logica/lancamento-logica';
import { Lancamento } from '../../core/persistence/model/lancamento';

export type MostraBalancoProps = {
    lancamentos : Lancamento[],
    goBack : Function
}

function MostraBalancoUI( props : MostraBalancoProps ): React.JSX.Element {

    const [totalEmEspecie, setTotalEmEspecie] = useState<number>(0);
    const [totalEmContaCorrente, setTotalEmContaCorrente] = useState<number>(0);
    const [lucroTotal, setLucroTotal] = useState<number>(0);
    const [debitoTotal, setDebitoTotal] = useState<number>(0);
    const [creditoTotal, setCreditoTotal] = useState<number>(0);
    const [outrosDebitosTotal, setOutrosDebitosTotal] = useState<number>(0);
    const [outrosCreditosTotal, setOutrosCreditosTotal] = useState<number>(0);

    const carregaTela = async () => {
        try {
            let lancs = props.lancamentos;            

            let lancTotais = await lancamentoLogica.carregaTotais( lancs );
        
            setTotalEmContaCorrente( lancTotais.totalEmContaCorrente );
            setTotalEmEspecie( lancTotais.totalEmEspecie );
            setCreditoTotal( lancTotais.creditoTotal );
            setDebitoTotal( lancTotais.debitoTotal );
            setOutrosDebitosTotal( lancTotais.outrosDebitosTotal );
            setOutrosCreditosTotal( lancTotais.outrosCreditosTotal );
            setLucroTotal( lancTotais.lucroTotal );
          } catch ( error : any ) {
            Alert.alert( error.message );
            throw error;
          }        
    };

    useEffect( () => {
      carregaTela();      
    }, [props.lancamentos] );
  
    return (
        <View style={[{padding: 10}]}> 
            <View style={globalStyle.buttonPanel}>
                <Button                                
                    color={globalStyle.buttonPrimary.color}
                    title='Voltar'
                    onPress={() => props.goBack() }
                />
            </View>

            <View style={[globalStyle.titlePanel]}>
                <Text style={[globalStyle.title, { textAlign: 'center'}]}>
                    Balanço
                </Text>
            </View>                        
            <View style={[styles.row, { marginTop: 5}]}>
                <View style={{flex: 1}}>
                    <Text>
                        Crédito: 
                    </Text>
                    <Text style={[styles.fieldValue, {color: '#00F'}]}>
                        {converter.formatBRL( creditoTotal )}
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    <Text>
                        Débito: 
                    </Text>
                    <Text style={[styles.fieldValue, {color: '#F00'}]}>
                        {converter.formatBRL( debitoTotal )}
                    </Text>
                </View>              
            </View>
            <View style={[styles.row, { marginTop: 5}]}>
                <View style={{flex: 1}}>           
                    <Text>
                        Crédito (outros): 
                    </Text>
                    <Text style={[styles.fieldValue, {color: '#00F'}]}>
                        {converter.formatBRL( outrosCreditosTotal )}
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    <Text>
                        Débito (outros): 
                    </Text>
                    <Text style={[styles.fieldValue, {color: '#F00'}]}>
                        {converter.formatBRL( outrosDebitosTotal )}
                    </Text>
                </View>              
            </View>
            <View style={[styles.row, {marginTop: 5}]}>              
                <View style={{flex: 1}}>
                    <Text>
                        Em espécie:
                    </Text>
                    <Text style={[styles.fieldValue, {color: totalEmEspecie < 0 ? '#F00' : '#00F'}]}>
                        {converter.formatBRL( totalEmEspecie )}
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    <Text>
                        Na conta: 
                    </Text>
                    <Text style={[styles.fieldValue, {color: totalEmContaCorrente < 0 ? '#F00' : '#00F'}]}>
                        {converter.formatBRL( totalEmContaCorrente )}
                    </Text>
                </View>              
            </View>
            <View style={[styles.total, { marginTop: 5}]}>                             
                <View style={{flex:1}}>
                    <Text style={{fontWeight: 'bold'}}>
                        Lucro: 
                    </Text>
                    <Text style={[styles.fieldValue, {color: lucroTotal < 0 ? '#F00' : '#00F'}]}>
                        {converter.formatBRL( lucroTotal )}
                    </Text>
                </View>  
            </View>            
        </View>               
    );
    
  }
  
  const styles = StyleSheet.create({             
    row : {
      flexDirection: 'row',
    },

    fieldValue: {
      fontWeight: 'normal',
      fontSize: 24
    },

    total : {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#CCF',
      borderRadius: 10,
      padding: 5
    },
    
  });
  
  export default MostraBalancoUI;
  