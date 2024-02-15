import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet
} from 'react-native';

import * as converter from '../../core/converter/converter';

import SimpleTextUI from '../ui/TextUI';
import BoxFieldUI from '../ui/BoxFieldUI';
import TextUI from '../ui/TextUI';
import ViewUI from '../ui/ViewUI';
import TitleUI from '../ui/TitleUI';

import {Lancamento} from '../../core/persistence/model/lancamento';
import * as lancamentoLogica from '../../core/logica/lancamento-logica';

export type FiltraLancamentosProps = {
    lancamentos : Lancamento[],
    navigateToSaveLancamentos : Function,
    navigateToDetalhesLancamentos : Function,
};

const MAX_SHOW_REGS : number = 200;

function FiltraLancamentosUI( props : FiltraLancamentosProps ): React.JSX.Element {

    const [dataLancMaisAntigo, setDataLancMaisAntigo] = useState<Date>(new Date());
    const [totalEmEspecie, setTotalEmEspecie] = useState<number>(0);
    const [totalEmContaCorrente, setTotalEmContaCorrente] = useState<number>(0);
    const [lucroTotal, setLucroTotal] = useState<number>(0);
    const [debitoTotal, setDebitoTotal] = useState<number>(0);
    const [creditoTotal, setCreditoTotal] = useState<number>(0);

    const [gruposLancs, setGruposLancs] = useState<any[]>([]);
    const [gruposLancsExpandir, setGruposLancsExpandir] = useState<boolean[]>([]);

    const setExpandirGrupo = async ( index : number) => {
        gruposLancsExpandir[ index ] = !gruposLancsExpandir[ index ];
        setGruposLancsExpandir( [...gruposLancsExpandir] );
    };

    const carregaTela = async () => {
        let lancs = props.lancamentos;

        let gpLancsExpandir : boolean[] = [];
        for( let i = 0; i < lancs.length; i++ )
            gpLancsExpandir.push( false );        

        let lancTotais = await lancamentoLogica.carregaTotais( lancs );
        let gruposLancs = await lancamentoLogica.carregaGruposLancs( lancs )
        let dtLancMaisAntigo = await lancamentoLogica.dataLancMaisAntigo( lancs );

        setTotalEmContaCorrente( lancTotais.totalEmContaCorrente );
        setTotalEmEspecie( lancTotais.totalEmEspecie );
        setCreditoTotal( lancTotais.creditoTotal );
        setDebitoTotal( lancTotais.debitoTotal );
        setLucroTotal( lancTotais.lucroTotal );

        setDataLancMaisAntigo( dtLancMaisAntigo );
        setGruposLancs( gruposLancs );                
        setGruposLancsExpandir( gpLancsExpandir );
    };

    useEffect( () => {
      carregaTela();      
    }, [props.lancamentos] );
  
    return ( 
      <ViewUI marginTop={5}>
        <ViewUI marginTop={10}>
            <SimpleTextUI>
                De {converter.formatDate( dataLancMaisAntigo )} até {converter.formatDate( new Date() )}
            </SimpleTextUI>

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

        <TitleUI title='Lista de lançamentos' marginTop={10} />      

        <ViewUI marginBottom={20}>        
          {props.lancamentos.length > MAX_SHOW_REGS && 
            <TextUI variant='primary' padding={5}>
               Número de lançamentos maior que {MAX_SHOW_REGS}. Por isso, 
                os lançamentos foram omitidos.
            </TextUI>            
          }
          {props.lancamentos.length <= MAX_SHOW_REGS && gruposLancs.map( ( grupo : any, index : number ) => { 
              return (
                <ViewUI key={index}>
                  <Pressable 
                    onPress={() => setExpandirGrupo(index) }>
                      <ViewUI 
                          padding={12} 
                          margin={1} 
                          background='light' 
                          isRow={true}
                          justifyContent="space-between">
                        <TextUI variant='dark-x'>
                            {converter.formatDate( grupo.dataLanc )}
                        </TextUI>
                        <TextUI variant={grupo.valor < 0 ? 'danger' : 'primary'}>
                            {converter.formatBRL( grupo.valor )}
                        </TextUI>
                      </ViewUI>                      
                  </Pressable>  
                  <ViewUI> 
                    { gruposLancsExpandir[ index ] == true &&
                      grupo.lancamentos.map( (lancamento : Lancamento, index2 : number) => {
                        return (
                          <Pressable key={index2}
                              onPress={ () => props.navigateToDetalhesLancamentos( lancamento.id ) }
                          >
                            <ViewUI 
                                paddingHorizontal={12} 
                                paddingVertical={5}
                                margin={1} 
                                isRow={true}
                                justifyContent="space-between">
                              <TextUI variant={lancamento.tipo === 'debito' ? 'danger' : 'primary'}>
                                  {lancamento.tipo === 'debito' ? 'Débito' : 'Crédito'}
                              </TextUI>
                              <TextUI variant={lancamento.tipo === 'debito' ? 'danger' : 'primary'}>
                                  {converter.formatBRL( lancamento.valor )}
                              </TextUI>
                            </ViewUI>   
                          </Pressable>
                        )
                      } )                               
                    }    
                  </ViewUI> 
                </ViewUI>                
              )
            } )}          
        </ViewUI>        
      </ViewUI>
    );
    
  }
  
  const styles = StyleSheet.create({             
    
  });
  
  export default FiltraLancamentosUI;
  