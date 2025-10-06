import { StyleSheet } from 'react-native';
import { height, width } from 'react-native-dimension';
import { colors } from './../../../constants/index';

const styles = StyleSheet.create({
    cardview: {
        backgroundColor: 'white',
        marginHorizontal: '3%',
        marginBottom: width(3),
        borderRadius: 8,
        elevation: 2,
    },
    innerview: {
        flexDirection: 'row',
        width: '90%',
        paddingBottom: '4%',
        alignItems: 'center',
    },
    imgview: {
        flexWrap: 'wrap',
        width: '30%',
        marginLeft: '4%',
        marginTop: '4%',
        marginBottom: '4%',
    },
    img: {
        height: height(12),
        width: width(25),
        borderRadius: 10,
    },
    txtview: {
        width: '60%',
        marginLeft: '4%',
        marginTop: '4%',
    },
    nameview: {
        flexDirection: 'row',
    },
    txtname: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
        flexWrap: 'wrap',
        width: '80%',
    },

    txtstyle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.pinkColor,
        width: '40%',
    },
    txtdate: {
        color: 'black',
    },
    btnview: {
        backgroundColor: colors.pinkColor,
        marginLeft: '34%',
        borderRadius: 10,
        padding: 2,
        marginTop: '2%',
        width: '80%',
    },
    btntxt: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 12,
    },
});

export default styles;