import { StyleSheet } from "react-native";

export default StyleSheet.create({          
    titlePanel: {
      marginBottom: 5
    },
    title: {
      fontSize: 24
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

    field: {
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