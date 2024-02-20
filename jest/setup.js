


jest.mock("react-native-bootsplash", () => {
    return {
        hide: jest.fn().mockResolvedValue(),
        isVisible: jest.fn().mockResolvedValue(false),
        useHideAnimation: jest.fn().mockReturnValue({
        container: {},
        logo: { source: 0 },
        brand: { source: 0 },
        }),
    };
});

jest.mock("expo-sqlite/next", () => {
    return {
        openDatabase : jest.fn().mockReturnValue({ transaction: () => {} }),
        SQLiteProvider : jest.fn().mockReturnValue({
            children : undefined,
            databaseName : ''
        })
    }
});

jest.mock("react-native-snackbar", () => {
    return {
        text: '',
        duration: 0,
        textColor: '#FFF',
        backgroundColor: '#F55',
        numberOfLines: 20        
      }
} );
