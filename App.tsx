import React, { useState } from 'react';
import {  
  StatusBar,
  StatusBarStyle,
  StyleSheet
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';

import BootSplash from 'react-native-bootsplash';

import { SQLiteProvider } from 'expo-sqlite/next';
import { persistence } from './src/core/persistence/persistence';

import BottomTabs from './src/shared/bottom-tabs/bottom-tabs';

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
            <BottomTabs />          
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
