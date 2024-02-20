import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { StackParamsList } from './StackParamsList';
import TelaLancamentos from '../../features/lancamento/tela-lancamentos';
import SalvaLancamento from '../../features/lancamento/salva-lancamento';
import DetalhesLancamento from '../../features/lancamento/detalhes-lancamento';
import MostraBalanco from '../../features/lancamento/mostra-balanco';

const Stack = createNativeStackNavigator<StackParamsList>();

function LancamentoScreens(): React.JSX.Element {
  
  return (          
    <Stack.Navigator initialRouteName="TelaLancamentos" screenOptions={{headerShown: false}}>
        <Stack.Screen name="SalvaLancamento" component={SalvaLancamento} />
        <Stack.Screen name="DetalhesLancamento" component={DetalhesLancamento} />
        <Stack.Screen name="TelaLancamentos" component={TelaLancamentos} />
        <Stack.Screen name="MostraBalanco" component={MostraBalanco} />
    </Stack.Navigator>
  );
}

export default LancamentoScreens;
