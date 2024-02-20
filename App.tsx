import React, { useState } from 'react';
import {  
  Alert,
  StatusBar,
  StatusBarStyle,
  StyleSheet
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import BootSplash from 'react-native-bootsplash';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCashRegister, faCircleDollarToSlot, faGear, faUserTag } from '@fortawesome/free-solid-svg-icons';

import DevedorScreens from './src/shared/screens/screens-devedor';
import LancamentoScreens from './src/shared/screens/screens-lancamento';

import Ajustes from './src/features/ajuste/ajustes';
import { SQLiteProvider } from 'expo-sqlite/next';
import { persistence } from './src/core/persistence/persistence';
import LancamentosGrupoScreens from './src/shared/screens/screens-lancamentos-grupo';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(
    'light-content'
  );

  return (    
      <React.Fragment>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor='#08F'
        />  
        <SQLiteProvider databaseName='cjapp.db' onInit={persistence.inicializa}>
          <NavigationContainer onReady={() => BootSplash.hide()}>            
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
          </NavigationContainer>
        </SQLiteProvider>
      </React.Fragment>
  );
}

const styles = StyleSheet.create({ 
  tabBarItem: {
    fontSize: 24
  },
  mainContainer: {
    padding: 5
  },
  mainScrollView: {

  },
  mainView: {

  },
  tabOption: {
    fontSize: 18,
    color: '#333'
  }
});

export default App;
