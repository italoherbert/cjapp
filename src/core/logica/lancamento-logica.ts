import { Lancamento } from "../persistence/model/lancamento";
import { LancTotais } from "./model/lanc-totais";

import * as dateUtil from '../util/date-util'

export const carregaTotais = async ( lancs : Lancamento[] ) => {
    let totEmContaCorrente = 0;
    let totEmEspecie = 0;
    let totDebito = 0;
    let totCredito = 0;
    let totOutrosDebitos = 0;
    let totOutrosCreditos = 0;    

    for( let lanc of lancs ) {
      if ( lanc.tipo === 'debito' ) {        
        if ( lanc.emContaCorrente == true ) {
          totEmContaCorrente -= lanc.valor;
        } else {
          totEmEspecie -= lanc.valor;
        }

        if ( lanc.doJogo == true ) {
          totDebito += lanc.valor;
        } else {
          totOutrosDebitos += lanc.valor;
        }
      } else {        
        if ( lanc.emContaCorrente == true ) {
          totEmContaCorrente += lanc.valor;
        } else {
          totEmEspecie += lanc.valor;
        }
        
        if ( lanc.doJogo == true ) {
          totCredito += lanc.valor;
        } else {
          totOutrosCreditos += lanc.valor;
        }
      }
    };
        
    let creditoTotalGeral = totCredito + totOutrosCreditos;
    let debitoTotalGeral = totDebito + totOutrosDebitos;
    let totalGeral = creditoTotalGeral - debitoTotalGeral;

    let lucroTotal = totCredito - totDebito;

    let lancTotais = new LancTotais();
    lancTotais.totalEmEspecie = totEmEspecie;
    lancTotais.totalEmContaCorrente = totEmContaCorrente;
    lancTotais.debitoTotal = totDebito;
    lancTotais.creditoTotal = totCredito;
    lancTotais.outrosDebitosTotal = totOutrosDebitos;
    lancTotais.outrosCreditosTotal = totOutrosCreditos;

    lancTotais.debitoTotalGeral = debitoTotalGeral;
    lancTotais.creditoTotalGeral = creditoTotalGeral;
    lancTotais.totalGeral = totalGeral;
    
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

      let dataLancStr = dateUtil.formatDate( lanc.dataLanc );

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
      let d1 = dateUtil.formatInvertDate( g1.dataLanc );
      let d2 = dateUtil.formatInvertDate( g2.dataLanc );
      if ( d1 < d2 )
        return 1;
      if ( d1 > d2 )
        return -1;
      return 0;
  } );
};

export const dataLancMaisAntigo = async ( lancs : Lancamento[] ) => {
    let date = new Date();
    for( let lanc of lancs )            
        if ( new Date( lanc.dataLanc ).getTime() < date.getTime() )
            date = new Date( lanc.dataLanc );    
    return date;
};

export const selectLancsAteAData = ( lancs : Lancamento[], data : Date ) => {
  let dataMaxMS = dateUtil.toDateMaxTime( data ).getTime(); 

  let lancamentos = [];
  for( let lanc of lancs ) {
    let lancMS = new Date( lanc.dataLanc ).getTime();
    if ( lancMS <= dataMaxMS )
      lancamentos.push( lanc );
  }

  return lancamentos;
}