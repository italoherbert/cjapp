import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

import * as formatter from '../../core/converter/converter';

import globalStyle from '../../core/style/global-style';

import {Lancamento} from '../../core/persistence/model/lancamento';

export type FiltraLancamentosProps = {
    lancamentos : Lancamento[],
    navigateToSaveLancamentos : Function,
    navigateToDetalhesLancamentos : Function,
};

const MAX_SHOW_REGS = 200;

function FiltraLancamentosUI( props : FiltraLancamentosProps ): React.JSX.Element {

    const [dataLancMaisAntigo, setDataLancMaisAntigo] = useState<Date>(new Date());
    const [totalEmEspecie, setTotalEmEspecie] = useState<number>(0);
    const [totalEmContaCorrente, setTotalEmContaCorrente] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
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

        let date = new Date();
        let totEmContaCorrente = 0;
        let totEmEspecie = 0;
        let totDebito = 0;
        let totCredito = 0;

        let map = new Map<string, any>();
        for( let lanc of lancs ) {
            let valor = 0;                    
            if ( lanc.tipo === 'debito' ) {
              
              if ( lanc.emContaCorrente == true ) {
                totEmContaCorrente -= lanc.valor;
              } else {
                totEmEspecie -= lanc.valor;
              }

              totDebito += lanc.valor;
              valor = -lanc.valor;
            } else {
              
              if ( lanc.emContaCorrente == true ) {
                totEmContaCorrente += lanc.valor;
              } else {
                totEmEspecie += lanc.valor;
              }
              
              totCredito += lanc.valor;
              valor = lanc.valor;
            }

            if ( new Date( lanc.dataLanc ).getTime() < date.getTime() )
                date = new Date( lanc.dataLanc );

            let dataLancStr = formatter.formatDate( lanc.dataLanc );

            let grupo = map.get( dataLancStr );
            if ( grupo === null || grupo === undefined ) {
                map.set( dataLancStr, {
                  valor : valor,
                  dataLanc : lanc.dataLanc,
                  expandir: true,
                  lancamentos: [ lanc ]
                } );
            } else {
                map.set( dataLancStr, {
                  valor : grupo.valor + valor,
                  dataLanc : grupo.dataLanc,
                  expandir : grupo.expandir,
                  lancamentos: [...grupo.lancamentos, lanc ]
                } );
            }
            gruposLancsExpandir.push( false );
        };
        
        setGruposLancs( [...map.values()].sort( (g1, g2) => {
            let d1 = formatter.formatInvertDate( g1.dataLanc );
            let d2 = formatter.formatInvertDate( g2.dataLanc );
            if ( d1 < d2 )
              return 1;
            if ( d1 > d2 )
              return -1;
            return 0;
        } ) );

        let total = totCredito - totDebito;

        setTotalEmContaCorrente( totEmContaCorrente );
        setTotalEmEspecie( totEmEspecie );  
        setDebitoTotal( totDebito );
        setCreditoTotal( totCredito );
        setTotal( total );
        setDataLancMaisAntigo( date );
    };

    useEffect( () => {
      carregaTela();      
    }, [props.lancamentos] );
  
    return (
      <View style={{marginBottom: 20}}>                          
        <View style={[{marginTop: 10}]}>
            <Text style={globalStyle.fieldValue}>
              De {formatter.formatDate( dataLancMaisAntigo )} até {formatter.formatDate( new Date() )}
            </Text>
            <View style={[styles.row, { flex: 2, marginTop: 5}]}>
              <View style={{flex: 1}}>           
                <Text>
                  Crédito: 
                </Text>
                <Text style={[styles.fieldValue, {color: '#00F'}]}>
                  {formatter.formatBRL( creditoTotal )}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text>
                  Débito: 
                </Text>
                <Text style={[styles.fieldValue, {color: '#F00'}]}>
                  {formatter.formatBRL( debitoTotal )}
                </Text>
              </View>              
            </View>
            <View style={[styles.row, {flex: 2, marginTop: 5}]}>              
              <View style={{flex: 1}}>
                <Text>
                  Em espécie:
                </Text>
                <Text style={[styles.fieldValue, {color: totalEmEspecie < 0 ? '#F00' : '#00F'}]}>
                  {formatter.formatBRL( totalEmEspecie )}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text>
                  Na conta: 
                </Text>
                <Text style={[styles.fieldValue, {color: totalEmContaCorrente < 0 ? '#F00' : '#00F'}]}>
                  {formatter.formatBRL( totalEmContaCorrente )}
                </Text>
              </View>              
            </View>
            <View style={[styles.total, { marginTop: 5}]}>             
              <View>
                <Text style={{fontWeight: 'bold'}}>
                  Total: 
                </Text>
                <Text style={[styles.fieldValue, {color: total < 0 ? '#F00' : '#00F'}]}>
                  {formatter.formatBRL( total )}
                </Text>
              </View>  
            </View>
        </View>   

        <View style={[globalStyle.titlePanel, {marginTop: 10}]}>
            <Text style={globalStyle.title}>
                Lista de lançamentos
            </Text>
        </View>    
        <View>
          {props.lancamentos.length > MAX_SHOW_REGS && 
            <Text style={[globalStyle.primary, {padding: 5}]}>
              Número de lançamentos maior que {MAX_SHOW_REGS}. Por isso, 
              os lançamentos foram omitidos.
            </Text>
          }
          {props.lancamentos.length <= MAX_SHOW_REGS && gruposLancs.map( ( grupo : any, index : number ) => { 
              return (
                <View key={index}>
                  <Pressable 
                    onPress={() => setExpandirGrupo(index) }>
                      <View style={styles.listaField}>
                        <Text style={styles.listaValue}>
                          {formatter.formatDate( grupo.dataLanc )}
                        </Text>
                        <Text style={[styles.listaValue, {color: grupo.valor < 0 ? '#F00' : '#00F'}]}>
                          {formatter.formatBRL( grupo.valor )}
                        </Text>                                                
                    </View>
                  </Pressable>  
                  <View style={{marginVertical: 3}}> 
                    { gruposLancsExpandir[ index ] == true &&
                      grupo.lancamentos.map( (lancamento : Lancamento, index2 : number) => {
                        return (
                          <Pressable key={index2}
                              onPress={ () => props.navigateToDetalhesLancamentos( lancamento.id ) }
                          >
                            <View style={[styles.sublistaField]}>                              
                              <Text style={[styles.listaValue, {color: lancamento.tipo === 'debito' ? '#F00' : '#00F'}]}>
                                {lancamento.tipo === 'debito' ? 'Débito' : 'Crédito'}
                              </Text>
                              <Text style={[styles.listaValue, {color: lancamento.tipo === 'debito' ? '#F00' : '#00F'}]}>
                                {formatter.formatBRL( lancamento.valor )}
                              </Text>
                            </View>
                          </Pressable>
                        )
                      } )                               
                    }    
                  </View> 
                </View>                
              )
            } )}          
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
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#CCF',
      borderRadius: 10,
      padding: 5
    },

    listaField : {           
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',

      padding: 8,

      borderWidth: 1,
      borderColor: '#CCC',

      backgroundColor: '#DDD',
    },
    listaValue: {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#000'
    },

    sublistaField: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',

      padding: 5
    }, 
  });
  
  export default FiltraLancamentosUI;
  