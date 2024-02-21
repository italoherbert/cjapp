import React, { useEffect, useState } from 'react';
import {
  Pressable
} from 'react-native';

import * as dateUtil from '../../core/util/date-util';
import * as numberUtil from '../../core/util/number-util';

import TextUI from '../ui/TextUI';
import ViewUI from '../ui/ViewUI';
import TitleUI from '../ui/TitleUI';

import MostraBalancoResumidoUI from './mostra-balanco-resumido-ui';

import {Lancamento} from '../../core/persistence/model/lancamento';
import {LancamentosGrupo} from '../../core/persistence/model/lancamentos-grupo';

import * as lancamentoLogica from '../../core/logica/lancamento-logica';
import { handleError } from '../error/error-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

export type FiltraLancamentosProps = {
    lancamentosGrupoAberto? : LancamentosGrupo,
    lancamentos : Lancamento[],
    navigateToSaveLancamentos : Function,
    navigateToDetalhesLancamentos : Function,
    navitateToMostraBalanco : Function
};

const MAX_SHOW_REGS : number = 200;

function FiltraLancamentosUI( props : FiltraLancamentosProps ): React.JSX.Element {

    const [dataIni, setDataIni] = useState<Date>(new Date());
    const [dataFim, setDataFim] = useState<Date>(new Date());
    
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

        let gruposLancs = await lancamentoLogica.carregaGruposLancs( lancs );

        let dataIni = props.lancamentosGrupoAberto!.dataIni;

        let dataFim = new Date();
        if ( props.lancamentosGrupoAberto!.dataFim !== undefined )
          dataFim = props.lancamentosGrupoAberto!.dataFim;

        setGruposLancs( gruposLancs );                
        setGruposLancsExpandir( gpLancsExpandir );

        setDataIni( dataIni );
        setDataFim( dataFim );
    };

    const verBalancoAteODia = async ( dataDia : Date ) => {
        try {
          let lancs = lancamentoLogica.selectLancsAteAData( props.lancamentos, dataDia );
          props.navitateToMostraBalanco( lancs );
        } catch ( error ) {
          handleError( error );
        }
    }

    const getDataFimStr = ( dataFim : Date ) => {
      if ( dataFim === undefined || dataFim === null )
        return "o momento";
      if ( new Date( dataFim ).getTime() === 0 )
        return "o momento";

      return dateUtil.formatDate( dataFim );
    };

    useEffect( () => {
      carregaTela();      
    }, [props.lancamentos] );
  
    return ( 
      <ViewUI>
        <TextUI>
            { 'De ' + dateUtil.formatDate( dataIni ) + 
              ' até ' + getDataFimStr( dataFim ) }
        </TextUI>

        <MostraBalancoResumidoUI 
            lancamentos={props.lancamentos}
        />

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
                            {dateUtil.formatDate( grupo.dataLanc )}
                        </TextUI>  
                        <ViewUI isRow={true} alignItems="center">
                            <TextUI variant={grupo.valor < 0 ? 'danger' : 'primary'} 
                                    marginHorizontal={10}>
                                {numberUtil.formatBRL( grupo.valor )}
                            </TextUI>
                            <Pressable onPress={ () => verBalancoAteODia( grupo.dataLanc )}>
                              <FontAwesomeIcon icon={faEye} color="blue" />
                            </Pressable>
                        </ViewUI>                      
                        
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
                                  {
                                    ( lancamento.tipo === 'debito' ? 'Débito' : 'Crédito' ) + 
                                    ( lancamento.emContaCorrente == true ? ' em conta' : ' em espécie' )
                                  }
                              </TextUI>                              
                              <TextUI variant={lancamento.tipo === 'debito' ? 'danger' : 'primary'}>
                                  {numberUtil.formatBRL( lancamento.valor )}
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
  