import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SalvaDevedor from '../../features/devedor/salva-devedor';
import DetalhesDevedor from '../../features/devedor/detalhes-devedor';
import TelaDevedores from '../../features/devedor/tela-devedores';
import { StackParamsList } from '../StackParamsList';

const Stack = createNativeStackNavigator<StackParamsList>();

function DevedorScreens(): React.JSX.Element {
  
  return (          
    <Stack.Navigator initialRouteName="TelaDevedores" screenOptions={{headerShown: false}}>
        <Stack.Screen name="SalvaDevedor" component={SalvaDevedor} />
        <Stack.Screen name="DetalhesDevedor" component={DetalhesDevedor} />
        <Stack.Screen name="TelaDevedores" component={TelaDevedores} />
    </Stack.Navigator>
  );
}

export default DevedorScreens;