import React, { useState, useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import FoodCard from '../../../components/foodCard';
import { fontFamily, icons, images } from '../../../assets';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../constants';
import BackButton from '../../../components/backIcon';

const foodCardData = [
    {
        foodImage: images.meal,
        foodName: 'Caramello Spaghetti',
        foodRating: '4.8 (120+)  2.8 km away',
        price: '£78',
        offPrice: '£2.99',
        time: '20mins',
        cheifName: 'Leanne Wayne',
    },
    {
        foodImage: images.meal1,
        foodName: 'Caramello Spaghetti',
        foodRating: '4.8 (120+)  2.8 km away',
        price: '£78',
        offPrice: '£2.99',
        time: '20mins',
        cheifName: 'Leanne Wayne',
    },
    {
        foodImage: images.meal2,
        foodName: 'Caramello Spaghetti',
        foodRating: '4.8 (120+)  2.8 km away',
        price: '£78',
        offPrice: '£2.99',
        time: '20mins',
        cheifName: 'Leanne Wayne',
    },
    {
        foodImage: images.veggie,
        foodName: 'Caramello Spaghetti',
        foodRating: '4.8 (120+)  2.8 km away',
        price: '£78',
        offPrice: '£2.99',
        time: '20mins',
        cheifName: 'Leanne Wayne',
    },
];

const AllFoodScreen = () => {

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // fetchProducts();
    }, []);


    // const fetchProducts = async () => {
    //     if (loading || !hasMore) return;

    //     setLoading(true);

    //     try {
    //         // let res = 
    //         const newProducts = res.data.data;
    //         setProducts((prev) => [...prev, ...newProducts]);
    //         setHasMore(page < res.data.totalPages);
    //         setPage((prev) => prev + 1);
    //     } catch (error) {
    //         console.log("Fetch Error: ", error);
    //     }

    //     setLoading(false);
    // };


    const navigation = useNavigation();
    const segmentButtonData = [
        { name: 'Near me' },
        { name: 'Delivery ' },
        { name: 'Take-out' },
    ];
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.white,
            }}>
            <View
                style={{
                    backgroundColor: colors.white,
                    paddingBottom: 18,
                    elevation: 5,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 12,
                        paddingHorizontal: 10,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <BackButton
                            height={20}
                            icon={icons.ArrowLeft}
                            onPress={() => navigation.goBack()}
                        />
                        <Text style={{
                            fontFamily: fontFamily.poppinRegular,
                            fontSize: 18,
                            fontWeight: 500,
                            color: colors.redish
                        }}>
                            Delicacies
                        </Text>
                    </View>
                    <View style={{ marginRight: 12 }}>
                        <BackButton icon={icons.ShoppingCart} border={1} />
                    </View>
                </View>
                {/* <View style={{ alignItems: 'center' }}>
                    <FlatList
                        data={segmentButtonData}
                        horizontal={true}
                        renderItem={({ item, index }) => <SegmentedButtons item={item} />}
                        ItemSeparatorComponent={<View style={{ width: 8 }} />}
                    />
                </View> */}
            </View>
            <FlatList
                data={foodCardData}
                renderItem={({ item, index }) => (
                    <FoodCard item={item} heartIcon={icons.heart} />
                )}
            />
        </View>
    )
}

export default AllFoodScreen
