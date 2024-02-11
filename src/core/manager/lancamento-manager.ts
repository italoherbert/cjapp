import { Lancamento } from "../persistence/model/lancamento";
import { LancTotais } from "./model/lanc-totais";

import * as converter from '../converter/converter'

export const carregaTotais = async ( lancs : Lancamento[] ) => {
    let totEmContaCorrente = 0;
    let totEmEspecie = 0;
    let totDebito = 0;
    let totCredito = 0;

    for( let lanc of lancs ) {
      if ( lanc.tipo === 'debito' ) {
        
        if ( lanc.emContaCorrente == true ) {
          totEmContaCorrente -= lanc.valor;
        } else {
          totEmEspecie -= lanc.valor;
        }

        if ( lanc.doJogo == true )
          totDebito += lanc.valor;
      } else {
        
        if ( lanc.emContaCorrente == true ) {
          totEmContaCorrente += lanc.valor;
        } else {
          totEmEspecie += lanc.valor;
        }
        
        if ( lanc.doJogo == true )
          totCredito += lanc.valor;
      }
    };
    
    let total = totEmEspecie + totEmContaCorrente;
    let lucroTotal = totCredito - totDebito;

    let lancTotais = new LancTotais();
    lancTotais.totalEmEspecie = totEmEspecie;
    lancTotais.totalEmContaCorrente = totEmContaCorrente;
    lancTotais.debitoTotal = totDebito;
    lancTotais.creditoTotal = totCredito;
    lancTotais.total = total;
    lancTotais.lucroTotal = lucroTotal;

    return lancTotais;
};

export const carregaGruposLancs = async ( lancs : Lancamento[] ) => {
  let map = new Map<string, any>();
  for( let lanc of lancs ) {      
      let valor = 0;                    
      if ( lanc.tipo === 'debito' ) {
        valor = -lanc.valor;
      } else {
        valor = lanc.valor;
      }

      let dataLancStr = converter.formatDate( lanc.dataLanc );

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
  };
  
  return [...map.values()].sort( (g1, g2) => {
      let d1 = converter.formatInvertDate( g1.dataLanc );
      let d2 = converter.formatInvertDate( g2.dataLanc );
      if ( d1 < d2 )
        return 1;
      if ( d1 > d2 )
        return -1;
      return 0;
  } );
}

export const dataLancMaisAntigo = async ( lancs : Lancamento[] ) => {
    let date = new Date();
    for( let lanc of lancs )            
        if ( new Date( lanc.dataLanc ).getTime() < date.getTime() )
            date = new Date( lanc.dataLanc );    
    return date;
}