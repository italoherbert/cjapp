import React, { useEffect, useState } from 'react';

import * as numberUtil from '../../core/util/number-util';

import * as lancamentoLogica from '../../core/logica/lancamento-logica';
import { Lancamento } from '../../core/persistence/model/lancamento';
import ViewUI from '../ui/ViewUI';
import TitleUI from '../ui/TitleUI';
import BoxFieldUI from '../ui/BoxFieldUI';
import TextUI from '../ui/TextUI';
import { handleError } from '../error/error-handler';
import { LancTotais } from '../../core/logica/model/lanc-totais';
import LineUI from '../ui/LineUI';

export type MostraBalancoProps = {
    lancamentos : Lancamento[]
}

function MostraBalancoUI( props : MostraBalancoProps ): React.JSX.Element {

    const [totais, setTotais] = useState<LancTotais>(new LancTotais());

    const carregaTela = async () => {
        try {
            let lancs = props.lancamentos;            

            let lancTotais = await lancamentoLogica.carregaTotais( lancs );        
            setTotais( lancTotais );
          } catch ( error ) {
            handleError( error );
          }        
    };

    useEffect( () => {
      carregaTela();      
    }, [props.lancamentos] );
  
    return (
        <ViewUI>
            <BoxFieldUI flex={2} isRow={true} marginVertical={5}> 
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Crédito (Jogo)</TextUI>
                <TextUI variant='primary' size='big-x'>
                  {numberUtil.formatBRL( totais.creditoTotal )}
                </TextUI>
              </BoxFieldUI>

              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Débito (Jogo)</TextUI>
                <TextUI variant='danger' size='big-x'>
                  {numberUtil.formatBRL( totais.debitoTotal )}
                </TextUI>
              </BoxFieldUI>             
            </BoxFieldUI>

            <BoxFieldUI flex={2} isRow={true} marginVertical={5}> 
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Crédito (outros)</TextUI>
                <TextUI variant='primary' size='big-x'>
                    {numberUtil.formatBRL( totais.outrosCreditosTotal )}
                </TextUI>
              </BoxFieldUI>

              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Débito (outros)</TextUI>
                <TextUI variant='danger' size='big-x'>
                    {numberUtil.formatBRL( totais.outrosDebitosTotal )}
                </TextUI>
              </BoxFieldUI>             
            </BoxFieldUI>

            <LineUI variant='primary' />

            <BoxFieldUI flex={2} isRow={true} marginVertical={5}> 
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Crédito (Geral)</TextUI>
                <TextUI variant='primary' size='big-x'>
                    {numberUtil.formatBRL( totais.creditoTotalGeral )}
                </TextUI>
              </BoxFieldUI>

              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Débito (Geral)</TextUI>
                <TextUI variant='danger' size='big-x'>
                    {numberUtil.formatBRL( totais.debitoTotalGeral )}
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
                      variant={ totais.totalGeral < 0 ? 'danger' : 'normal' } 
                      size='big-x'>
                  {numberUtil.formatBRL( totais.totalGeral )}
                </TextUI>
              </BoxFieldUI>  
            </BoxFieldUI>

            <BoxFieldUI flex={2} isRow={true} marginTop={15} marginBottom={5}> 
              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Em espécie</TextUI>
                <TextUI
                      variant={ totais.totalEmEspecie < 0 ? 'danger' : 'normal' } 
                      size='big-x'>
                  {numberUtil.formatBRL( totais.totalEmEspecie )}
                </TextUI>
              </BoxFieldUI>

              <BoxFieldUI flex={1} isRow={false}>
                <TextUI>Na conta</TextUI>
                <TextUI 
                      variant={ totais.totalEmContaCorrente < 0 ? 'danger' : 'normal' } 
                      size='big-x'>
                  {numberUtil.formatBRL( totais.totalEmContaCorrente )}
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
                      variant={ totais.lucroTotal < 0 ? 'danger' : 'normal' } 
                      size='big-x'>
                  {numberUtil.formatBRL( totais.lucroTotal )}
                </TextUI>
              </BoxFieldUI>  
            </BoxFieldUI>
        </ViewUI>          
    );
    
  }
    
  export default MostraBalancoUI;
  