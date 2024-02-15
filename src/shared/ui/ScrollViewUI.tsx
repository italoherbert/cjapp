
import React from 'react';

import {
    ScrollView, StyleSheet
} from 'react-native';

export type ScrollViewProps = React.PropsWithChildren<{

}>;

function ScrollViewUI ( { children } : ScrollViewProps ) : React.JSX.Element {
    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
                {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView : {
        padding: 10
    }
});

export default ScrollViewUI;
