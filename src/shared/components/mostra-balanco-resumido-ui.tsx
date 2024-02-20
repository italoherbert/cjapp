import React, { useEffect, useState } from 'react';

import * as converter from '../../core/converter/converter';

import * as lancamentoLogica from '../../core/logica/lancamento-logica';
import { Lancamento } from '../../core/persistence/model/lancamento';
import ViewUI from '../ui/ViewUI';
import TitleUI from '../ui/TitleUI';
import BoxFieldUI from '../ui/BoxFieldUI';
import TextUI from '../ui/TextUI';
import { handleError } from '../error/error-handler';

export type MostraBalancoProps = {
    lancamentos : Lancamento[]
}

function MostraBalancoResumidoUI( props : MostraBalancoProps ): React.JSX.Element {

    const [creditoTotalGeral, setCreditoTotalGeral] = useState<number>(0);
    const [debitoTotalGeral, setDebitoTotalGeral] = useState<number>(0);
    const [totalGeral, setTotalGeral] = useState<number>(0);
    const [totalEmEspecie, setTotalEmEspecie] = useState<number>(0);
    const [totalEmContaCorrente, setTotalEmContaCorrente] = useState<number>(0);
    
    const carregaTela = async () => {
        try {
            let lancs = props.lancamentos;            

            let lancTotais = await lancamentoLogica.carregaTotais( lancs );
        
            setTotalEmContaCorrente( lancTotais.totalEmContaCorrente );
            setTotalEmEspecie( lancTotais.totalEmEspecie );
            setCreditoTotalGeral( lancTotais.creditoTotalGeral );
            setDebitoTotalGeral( lancTotais.debitoTotalGeral );
            setTotalGeral( lancTotais.totalGeral );
          } catch ( error ) {
            handleError( error )
          }        
    };

    useEffect( () => {
      carregaTela();      
    }, [props.lancamentos] );
  
    return (
        <ViewUI>
            <BoxFieldUI flex={2} isRow={true} marginVertical={5}> 
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Crédito Geral</TextUI>
                <TextUI variant='primary' size='big-x'>
                  {converter.formatBRL( creditoTotalGeral )}
                </TextUI>
              </BoxFieldUI>

              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Débito Geral</TextUI>
                <TextUI variant='danger' size='big-x'>
                  {converter.formatBRL( debitoTotalGeral )}
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
                <TextUI>Total Geral</TextUI>
                <TextUI 
                      variant={ totalGeral < 0 ? 'danger' : 'normal' } 
                      size='big-x'>
                  {converter.formatBRL( totalGeral )}
                </TextUI>
              </BoxFieldUI>  
            </BoxFieldUI>
        </ViewUI>          
    );
    
  }
  
  export default MostraBalancoResumidoUI;
  