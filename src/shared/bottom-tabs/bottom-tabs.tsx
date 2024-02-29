import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCashRegister, faCircleDollarToSlot, faGear, faUserTag } from '@fortawesome/free-solid-svg-icons';

import DevedorScreens from '../screens/screens-devedor';
import LancamentoScreens from '../screens/screens-lancamento';
import LancamentosGrupoScreens from '../screens/screens-lancamentos-grupo';
import Ajustes from '../../features/ajuste/ajustes';

const Tab = createBottomTabNavigator();

function BottomTabs () : React.JSX.Element {
    return (
        <Tab.Navigator initialRouteName="Devedores" screenOptions={{headerShown: false}} >
            <Tab.Screen name="Devedores" 
                component={DevedorScreens} 
                options={{ 
                tabBarLabel: 'Devedores',                   
                tabBarIcon: ({focused, color, size} ) => {
                    return <FontAwesomeIcon icon={faUserTag} color={color} size={size} />
                },
                }}/>
            <Tab.Screen name="Lancamentos" 
                component={LancamentoScreens} 
                options={{ 
                tabBarLabel: 'Lançamentos',                   
                tabBarIcon: ({focused, color, size} ) => {
                    return <FontAwesomeIcon icon={faCashRegister} color={color} size={size} />
                },
                }}/>
            <Tab.Screen name="LancamentosGrupo" 
                component={LancamentosGrupoScreens} 
                options={{ 
                tabBarLabel: 'Grupos',                   
                tabBarIcon: ({focused, color, size} ) => {
                    return <FontAwesomeIcon icon={faCircleDollarToSlot} color={color} size={size} />
                },
                }}/>
            <Tab.Screen name="Ajustes"
                component={Ajustes} options={{ 
                tabBarLabel: 'Ajustes',                   
                tabBarIcon: ({focused, color, size} ) => {
                    return <FontAwesomeIcon icon={faGear} color={color} size={size} />
                },
                }}/>
        </Tab.Navigator> 
    );
}

export default BottomTabs;