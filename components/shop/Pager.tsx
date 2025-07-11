import { sample } from '@/data';
import { Image } from 'expo-image';
import React, { memo } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    View
} from 'react-native';
import PagerView, {
    PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


const DOT_SIZE = 40;

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const { width, height } = Dimensions.get('window');

const Pagination = ({
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
}: {
    scrollOffsetAnimatedValue: Animated.Value;
    positionAnimatedValue: Animated.Value;
}) => {
    const inputRange = [0, sample.length];
    const translateX = Animated.add(
        scrollOffsetAnimatedValue,
        positionAnimatedValue
    ).interpolate({
        inputRange,
        outputRange: [0, sample.length * DOT_SIZE],
    });

    return (
        <View style={[styles.pagination]}>
            <Animated.View
                style={[
                    styles.paginationIndicator,
                    {
                        position: 'absolute',
                        transform: [{ translateX: translateX }],
                    },
                ]}
            />
            {sample.map((item) => {
                return (
                    <View key={item.key} style={styles.paginationDotContainer}>
                        <View
                            style={[styles.paginationDot]}
                        />
                    </View>
                );
            })}
        </View>
    );
};
function PaginationDotsExample() {

    const ref = React.useRef<PagerView>(null);
    //const [currentPage, setCurrentPage] = useState(0);
    const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
    const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
    const inputRange = [0, sample.length];
    ;

    const onPageScroll = React.useMemo(
        () =>
            Animated.event<PagerViewOnPageScrollEventData>(
                [
                    {
                        nativeEvent: {
                            offset: scrollOffsetAnimatedValue,
                            position: positionAnimatedValue,
                        },
                    },
                ],
                {
                    useNativeDriver: true,
                }
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // useFocusEffect(
    //     useCallback(() => {
    //         const intervalId = setInterval(() => {
    //             setCurrentPage((prevPage) => {
    //                 const nextPage = (prevPage + 1) % sample.length;
    //                 ref.current?.setPage(nextPage);
    //                 return nextPage;
    //             });
    //             return () => {
    //                 clearInterval(intervalId);
    //             }
    //         }, 2500); // Change page every 3 seconds
    //     }, [])
    // );
    return (
        <View testID="safe-area-view" style={styles.flex}>
            <AnimatedPagerView
                testID="pager-view"
                initialPage={0}
                ref={ref}
                style={styles.PagerView}
                onPageScroll={onPageScroll}
            >
                {sample.map((item) => (
                    <View
                        testID={`pager-view-data-${item.key}`}
                        key={item.key}
                        style={styles.center}
                    >
                        <Image
                            style={styles.Image}
                            source={item.image}
                            placeholder={{ blurhash }}
                            contentFit="cover"
                            transition={1000}
                        />
                        <Pagination
                            scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
                            positionAnimatedValue={positionAnimatedValue}
                        />
                    </View>
                ))}
            </AnimatedPagerView>

        </View>
    );
}

export default memo(PaginationDotsExample)

const styles = StyleSheet.create({
    flex: {
        width: width,
        height: height / 4,
    },
    PagerView: {
        height: height / 4,
    },
    container: {
        flexDirection: 'row',
        backgroundColor: '#63a4ff',
    },
    progressContainer: { flex: 0.1, backgroundColor: '#63a4ff' },
    center: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',

    },
    text: {
        fontSize: 30,
    },

    Image: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 10,
    },

    pagination: {
        position: 'absolute',
        right: width / 3,
        bottom: 10,
        flexDirection: 'row',
        height: DOT_SIZE,
    },
    paginationDot: {
        width: DOT_SIZE * 0.3,
        height: DOT_SIZE * 0.3,
        borderRadius: DOT_SIZE * 0.15,
        backgroundColor: '#00000030',
    },
    paginationDotContainer: {
        width: DOT_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationIndicator: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        borderWidth: 2,
        borderColor: '#88defa',
    },
});