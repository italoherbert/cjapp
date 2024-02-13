import { StyleSheet } from "react-native";

export default StyleSheet.create({      
    mainScroll: {
      padding: 10
    },
    titlePanel: {
      marginBottom: 5
    },
    title: {
      fontSize: 24,
      fontVariant: ['small-caps']
    },

    primary: {
      color: '#669'
    },
    danger: {
      color: '#F00'
    },
    success : {
      color: '#080'
    },
    lineLayout: {
      flex: 1,
      flexDirection: 'row'
    },

    buttonPanel: {
      marginTop: 5,
      marginBottom: 5,
    },
    
    buttonPrimary: {
       color: '#08F'
    },

    buttonDanger: {
      color: '#F66'
    },

    field: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,      
    },
    fieldName: {            
      fontSize: 14,
      fontWeight: 'normal'
    },
    fieldValue: {
      fontSize: 14,
      fontWeight: 'normal'
    }   

  });