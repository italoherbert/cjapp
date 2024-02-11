import { StyleSheet } from "react-native";

export default StyleSheet.create({      
    mainScroll: {
      padding: 10
    },
    titlePanel: {
      marginBottom: 5
    },
    title: {
      fontSize: 24
    },

    primary: {
      color: '#08F'
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

    textInput : {
      marginTop: 5,
      marginBottom: 5,

      borderBottomWidth: 1,
      borderColor: '#338'      
    },

    dateInput : {
      flex: 1,
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between',

      borderBottomColor: '#338',
      borderBottomWidth: 1,

      paddingVertical: 15,
      paddingLeft: 5
    },

    buttonPanel: {
      marginTop: 5,
      marginBottom: 5,
    },
    buttonPrimary: {
       color: '#08F'
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