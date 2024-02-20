import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { StackParamsList } from './StackParamsList';
import TelaLancamentosGrupos from '../../features/lancamentos-grupo/tela-lancamentos-grupos';
import DetalhesLancamentosGrupo from '../../features/lancamentos-grupo/detalhes-lancamentos-grupo';
import NovoLancamentosGrupo from '../../features/lancamentos-grupo/novo-lancamentos-grupo';
import FechaLancamentosGrupo from '../../features/lancamentos-grupo/fecha-lancamentos-grupo';
import LancamentoScreens from './screens-lancamento';

const Stack = createNativeStackNavigator<StackParamsList>();

function LancamentosGrupoScreens(): React.JSX.Element {
  
  return (          
    <Stack.Navigator initialRouteName="TelaLancamentosGrupos" screenOptions={{headerShown: false}}>
        <Stack.Screen name="LancamentoScreens" component={LancamentoScreens} />
        <Stack.Screen name="TelaLancamentosGrupos" component={TelaLancamentosGrupos} />
        <Stack.Screen name="DetalhesLancamentosGrupo" component={DetalhesLancamentosGrupo} />
        <Stack.Screen name="NovoLancamentosGrupo" component={NovoLancamentosGrupo} />
        <Stack.Screen name="FechaLancamentosGrupo" component={FechaLancamentosGrupo} />
    </Stack.Navigator>
  );
}

export default LancamentosGrupoScreens;
