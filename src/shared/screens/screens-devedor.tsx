import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { StackParamsList } from './StackParamsList';
import SalvaDevedor from '../../features/devedor/salva-devedor';
import DetalhesDevedor from '../../features/devedor/detalhes-devedor';
import TelaDevedores from '../../features/devedor/tela-devedores';
import AddOuSubDebitoDevedor from '../../features/devedor/add-ou-sub-debito-devedor';

const Stack = createNativeStackNavigator<StackParamsList>();

function DevedorScreens(): React.JSX.Element {
  
  return (          
    <Stack.Navigator initialRouteName="TelaDevedores" screenOptions={{headerShown: false}}>
        <Stack.Screen name="SalvaDevedor" component={SalvaDevedor} />
        <Stack.Screen name="DetalhesDevedor" component={DetalhesDevedor} />
        <Stack.Screen name="TelaDevedores" component={TelaDevedores} />
        <Stack.Screen name="AddOuSubDebitoDevedor" component={AddOuSubDebitoDevedor} />
    </Stack.Navigator>
  );
}

export default DevedorScreens;