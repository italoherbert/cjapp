import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';

import * as converter from '../../core/converter/converter';

import * as lancamentoLogica from '../../core/logica/lancamento-logica';
import { Lancamento } from '../../core/persistence/model/lancamento';
import ViewUI from '../ui/ViewUI';
import TitleUI from '../ui/TitleUI';
import BoxFieldUI from '../ui/BoxFieldUI';
import TextUI from '../ui/TextUI';

export type MostraBalancoProps = {
    lancamentos : Lancamento[]
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
        <ViewUI>
            <TitleUI title='Balanço' />

            <BoxFieldUI flex={2} isRow={true} marginVertical={5}> 
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Crédito</TextUI>
                <TextUI variant='primary' size='big-x'>
                  {converter.formatBRL( creditoTotal )}
                </TextUI>
              </BoxFieldUI>

              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Débito</TextUI>
                <TextUI variant='danger' size='big-x'>
                  {converter.formatBRL( debitoTotal )}
                </TextUI>
              </BoxFieldUI>             
            </BoxFieldUI>

            <BoxFieldUI flex={2} isRow={true} marginVertical={5}> 
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Crédito (outros)</TextUI>
                <TextUI variant='primary' size='big-x'>
                    {converter.formatBRL( outrosCreditosTotal )}
                </TextUI>
              </BoxFieldUI>

              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Débito (outros)</TextUI>
                <TextUI variant='danger' size='big-x'>
                    {converter.formatBRL( outrosDebitosTotal )}
                </TextUI>
              </BoxFieldUI>             
            </BoxFieldUI>

            <BoxFieldUI flex={2} isRow={true} marginVertical={5}> 
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Em espécie</TextUI>
                <TextUI
                      variant={ totalEmEspecie < 0 ? 'danger' : 'normal' } 
                      size='big-x'>
                  {converter.formatBRL( totalEmEspecie )}
                </TextUI>
              </BoxFieldUI>

              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Na conta</TextUI>
                <TextUI 
                      variant={ totalEmContaCorrente < 0 ? 'danger' : 'normal' } 
                      size='big-x'>
                  {converter.formatBRL( totalEmContaCorrente )}
                </TextUI>
              </BoxFieldUI>             
            </BoxFieldUI>

            <BoxFieldUI flex={1} isRow={false} 
                  marginVertical={5} 
                  alignItems='center'
                  background='light'
                  padding={10}>
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Lucro</TextUI>
                <TextUI 
                      variant={ lucroTotal < 0 ? 'danger' : 'normal' } 
                      size='big-x'>
                  {converter.formatBRL( lucroTotal )}
                </TextUI>
              </BoxFieldUI>  
            </BoxFieldUI>
        </ViewUI>          
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
      backgroundColor: '#DDD',
      borderRadius: 10,
      padding: 5
    },
    
  });
  
  export default MostraBalancoUI;
  