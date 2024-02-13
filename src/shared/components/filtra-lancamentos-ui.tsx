import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

import * as converter from '../../core/converter/converter';

import globalStyle from '../style/global-style';

import {Lancamento} from '../../core/persistence/model/lancamento';
import * as lancamentoLogica from '../../core/logica/lancamento-logica';

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
      <View style={{marginTop: 5}}>                                   
        <View style={[{marginTop: 10}]}>            
            <Text style={globalStyle.fieldValue}>
              De {converter.formatDate( dataLancMaisAntigo )} até {converter.formatDate( new Date() )}
            </Text>
            <View style={[styles.row, { flex: 2, marginTop: 5}]}>
              <View style={{flex: 1}}>           
                <Text>
                  Crédito: 
                </Text>
                <Text style={[styles.fieldValue, {color: '#666'}]}>
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
            <View style={[styles.row, {flex: 2, marginTop: 5}]}>              
              <View style={{flex: 1}}>
                <Text>
                  Em espécie:
                </Text>
                <Text style={[styles.fieldValue, {color: totalEmEspecie < 0 ? '#F00' : '#666'}]}>
                  {converter.formatBRL( totalEmEspecie )}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text>
                  Na conta: 
                </Text>
                <Text style={[styles.fieldValue, {color: totalEmContaCorrente < 0 ? '#F00' : '#666'}]}>
                  {converter.formatBRL( totalEmContaCorrente )}
                </Text>
              </View>              
            </View>
            <View style={[styles.total, { marginTop: 5}]}>                           
              <View>
                <Text style={{fontWeight: 'bold'}}>
                  Lucro: 
                </Text>
                <Text style={[styles.fieldValue, {color: lucroTotal < 0 ? '#F00' : '#666'}]}>
                  {converter.formatBRL( lucroTotal )}
                </Text>
              </View>  
            </View>
        </View>   

        <View style={[globalStyle.titlePanel, {marginTop: 10}]}>
            <Text style={globalStyle.title}>
                Lista de lançamentos
            </Text>
        </View>    
        <View style={{marginBottom: 20}}>
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
                          {converter.formatDate( grupo.dataLanc )}
                        </Text>
                        <Text style={[styles.listaValue, {color: grupo.valor < 0 ? '#F00' : '#00F'}]}>
                          {converter.formatBRL( grupo.valor )}
                        </Text>                                                
                    </View>
                  </Pressable>  
                  <View> 
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
                                {converter.formatBRL( lancamento.valor )}
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
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#DDD',
      borderRadius: 10,
      padding: 5
    },

    listaField : {           
      flexDirection: 'row',
      justifyContent: 'space-between',

      padding: 12,

      borderWidth: 1,
      borderColor: '#EEE',

      backgroundColor: '#E4E4E4',
    },
    listaValue: {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#000'
    },

    sublistaField: {
      flexDirection: 'row',
      justifyContent: 'space-between',

      paddingHorizontal: 13,
      paddingVertical: 5
    }, 
  });
  
  export default FiltraLancamentosUI;
  