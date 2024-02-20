import React, { useEffect, useState } from 'react';
import {
  Pressable
} from 'react-native';

import * as converter from '../../core/converter/converter';

import TextUI from '../ui/TextUI';
import ViewUI from '../ui/ViewUI';
import TitleUI from '../ui/TitleUI';

import MostraBalancoResumidoUI from './mostra-balanco-resumido-ui';

import {Lancamento} from '../../core/persistence/model/lancamento';
import {LancamentosGrupo} from '../../core/persistence/model/lancamentos-grupo';

import * as lancamentoLogica from '../../core/logica/lancamento-logica';

export type FiltraLancamentosProps = {
    lancamentosGrupoAberto? : LancamentosGrupo,
    lancamentos : Lancamento[],
    navigateToSaveLancamentos : Function,
    navigateToDetalhesLancamentos : Function,
};

const MAX_SHOW_REGS : number = 200;

function FiltraLancamentosUI( props : FiltraLancamentosProps ): React.JSX.Element {

    const [dataIni, setDataIni] = useState<Date>(new Date());
    const [dataFim, setDataFim] = useState<Date>(new Date());
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
        let gruposLancs = await lancamentoLogica.carregaGruposLancs( lancs );

        let dataIni = props.lancamentosGrupoAberto!.dataIni;

        let dataFim = new Date();
        if ( props.lancamentosGrupoAberto!.dataFim !== undefined )
          dataFim = props.lancamentosGrupoAberto!.dataFim;

        setTotalEmContaCorrente( lancTotais.totalEmContaCorrente );
        setTotalEmEspecie( lancTotais.totalEmEspecie );
        setCreditoTotal( lancTotais.creditoTotal );
        setDebitoTotal( lancTotais.debitoTotal );
        setLucroTotal( lancTotais.lucroTotal );

        setGruposLancs( gruposLancs );                
        setGruposLancsExpandir( gpLancsExpandir );

        setDataIni( dataIni );
        setDataFim( dataFim );
    };

    const getDataFimStr = ( dataFim : Date ) => {
      if ( dataFim === undefined || dataFim === null )
        return "o momento";
      if ( new Date( dataFim ).getTime() === 0 )
        return "o momento";

      return converter.formatDate( dataFim );
    };

    useEffect( () => {
      carregaTela();      
    }, [props.lancamentos] );
  
    return ( 
      <ViewUI marginTop={5}>
        <ViewUI marginTop={10}>
            <TextUI>
                { 'De ' + converter.formatDate( dataIni ) + 
                  ' até ' + getDataFimStr( dataFim ) }
            </TextUI>

            <MostraBalancoResumidoUI 
                lancamentos={props.lancamentos}
            />
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
                          background='light'
                          border='light-x' 
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
                                margin={5} 
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
    
  export default FiltraLancamentosUI;
  