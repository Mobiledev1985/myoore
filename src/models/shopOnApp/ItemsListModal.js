import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  heightPixel,
} from '../../resources/styles/normalizedimension';
import {TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  BORDER_RADIUS_10,
  BORDER_RADIUS_4,
  FONT_16,
  FONT_28,
  HEIGHT_36,
  HEIGHT_4,
  HEIGHT_40,
  HORIZONTAL_33,
  VERTICAL_16,
  VERTICAL_5,
  WIDTH_3,
  WIDTH_50,
} from '../../resources/styles/responsive';
import {OOREDOO_REGULAR_FONT} from '../../resources/styles/fonts';
import TextComponent from '../basic/TextComponent';
import {Animated} from 'react-native';

const ItemsListModal = ({
  popupText,
  onDismiss,
  titleMsg,
  isFrom,
  buttonName,
  onTryAgainClick,
  type,
  governorate,
  value,
  itemsList,
  itemIndex = 0,
}) => {
  const animationHeight = useRef(70);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1); // Track current page
  const pageSize = 20; // Number of items to fetch per page
  const [modalVisible, setModalVisible] = useState(false);

  // Function to fetch data for a specific page
  const fetchData = async () => {
    try {
      if (itemsList?.length > data?.length) {
        try {
          setIsLoading(true);
          // Simulated API call to fetch data
          // const newData = dataAry(page, pageSize);
          // console.log('newData---->', newData);
          // setData(prevData => [...prevData, ...newData]);
          // setPage(prevPage => prevPage + 1);
          // setIsLoading(false);

          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const newData = itemsList.slice(startIndex, endIndex);
          // setTimeout(() => {
          setData(prevData => [...prevData, ...newData]);
          setIsLoading(false);
          setPage(prevPage => prevPage + 1);
          // }, 1000); // Simulate loading delay
        } catch (error) {}
      }
    } catch (error) {}
  };

  // Render loading indicator while data is being fetched
  const renderFooter = () => {
    return isLoading ? (
      <ActivityIndicator size="large" color={colors.OOREDOO_RED} />
    ) : null;
  };

  // Open modal and fetch initial data
  useEffect(() => {
    setModalVisible(true);
    fetchData();
  }, []);

  const nationalityrenderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{height: HEIGHT_40}}
        onPress={() => onTryAgainClick(item)}>
        <View
          style={[
            {height: heightPixel(38), flexDirection: 'row'},
            (item?.value === value &&
              value !== '' &&
              value !== undefined &&
              value != null) ||
            ((value === '' || value === undefined || value == null) &&
              index === itemIndex)
              ? {backgroundColor: colors.ITEMBACKGROUND_SHOP_GREEN}
              : {},
          ]}>
          <View
            style={
              (item?.value === value &&
                value !== '' &&
                value !== undefined &&
                value != null) ||
              ((value === '' || value === undefined || value == null) &&
                index === itemIndex)
                ? {
                    width: WIDTH_3,
                    // height: heightPixel(38),
                    backgroundColor: colors.SKYLIGHT_BLUE,
                  }
                : {}
            }
          />
          <TextComponent
            style={styles.title}
            data={item?.label}
            lines={1}
            type="text"
          />
        </View>
        <Image
          source={require('../../assets/line_dotted.png')}
          style={[styles.separator]}
        />
        {/* {areaItem.length - 1 == index ? null : (
            <DotsLineView />
          )} */}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={true}
      transparent
      Animated={true}
      animationType="slide"
      useNativeDriver={true}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onDismiss()}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust the opacity as needed
        }}>
        <View style={styles.modal}>
          <>
            <View
              style={[
                styles.modalInner,
                {
                  // height: HEIGHT_140,
                },
              ]}>
              <View style={styles.topView}>
                <View style={styles.lineView} />
              </View>
              {!!data.length && (
                <FlatList
                  style={{maxHeight: SCREEN_HEIGHT - heightPixel(200)}}
                  data={data}
                  initialNumToRender={data?.length}
                  showsVerticalScrollIndicator={true}
                  renderItem={nationalityrenderItem}
                  keyExtractor={(item, index) => index.toString()}
                  onEndReached={fetchData} // Call fetchData when reaching the end of the list
                  onEndReachedThreshold={0.1} // Trigger onEndReached when the end is within 10% of the list length
                  ListFooterComponent={renderFooter} // Show loading indicator at the bottom of the list
                />
              )}
            </View>
            {/* <Animated.View
              style={{
                height: animationHeight.current + HEIGHT_36,
                backgroundColor: colors.WHITE,
              }}
            /> */}
          </>
          {/* <View
            style={{
              // flex: 1,
              // justifyContent: 'center',
              // alignItems: 'center',
              backgroundColor: 'red',
              maxHeight: SCREEN_HEIGHT - heightPixel(200),
            }}>
            <FlatList
              data={data}
              renderItem={nationalityrenderItem}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={fetchData} // Call fetchData when reaching the end of the list
              onEndReachedThreshold={0.1} // Trigger onEndReached when the end is within 10% of the list length
              ListFooterComponent={renderFooter} // Show loading indicator at the bottom of the list
            />
          </View> */}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default React.memo(ItemsListModal);
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalInner: {
    shadowColor: colors.GREY,
    backgroundColor: colors.WHITE,
    shadowRadius: 6,
    width: SCREEN_WIDTH,
    elevation: 4,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  topView: {height: HEIGHT_36, alignItems: 'center'},
  lineView: {
    width: WIDTH_50,
    borderRadius: BORDER_RADIUS_4,
    backgroundColor: colors.OOREDDO_LIGHT_GREY,
    height: HEIGHT_4,
    top: VERTICAL_16,
  },
  title: {
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_16,
    lineHeight: FONT_28,
    color: colors.BLACK,
    marginHorizontal: HORIZONTAL_33,
    top: VERTICAL_5,
    textAlign: 'left',
  },
  loading: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
    borderTopLeftRadius: BORDER_RADIUS_10,
    borderTopRightRadius: BORDER_RADIUS_10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  separator: {
    width: SCREEN_WIDTH,
    height: heightPixel(2),
  },
});
