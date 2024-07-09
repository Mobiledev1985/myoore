import React, {useState} from 'react';
import {
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import colors from '../../resources/styles/colors';
import {FULL_WIDTH_PERCENTAGE} from '../../commonHelper/Constants';
import {
  FONT_13,
  FONT_16,
  FONT_30,
  HEIGHT_10,
  HEIGHT_12,
  HEIGHT_16,
  HEIGHT_30,
  HORIZONTAL_14,
  HORIZONTAL_20,
  HORIZONTAL_30,
  WIDTH_280,
} from '../../resources/styles/responsive';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import Icon from 'react-native-vector-icons/Entypo';
// import {
//   Collapse,
//   CollapseBody,
//   CollapseHeader,
// } from 'accordion-collapse-react-native';

const Faqs = ({title, listData, isFrom = '', onItemPress}) => {
  const [expandedIndex, setExpandedIndex] = useState(false);
  const [itemIndex, setItemIndex] = useState(null);
  try {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  } catch (error) {}

  // const renderItem = ({item, index}) => {
  //   return (
  //     <View>
  //       <Collapse
  //         isExpanded={index === expandedIndex}
  //         touchableOpacityProps={styles.opactiy}
  //         onToggle={value => {
  //           try {
  //             setExpandedIndex(value ? index : null);
  //             LayoutAnimation.configureNext(
  //               LayoutAnimation?.Presets?.easeInEaseOut
  //             );
  //           } catch (error) {}
  //         }}>
  //         <CollapseHeader>
  //           <View style={styles.header}>
  //             <Text style={styles.headerText}>
  //               {isFrom == 'ReceiptPage' ? item?.title : item?.question}
  //             </Text>

  //             <Icon
  //               name={
  //                 index === expandedIndex
  //                   ? 'chevron-thin-up'
  //                   : 'chevron-thin-down'
  //               }
  //               size={16}
  //               color={colors.OOREDOO_BLACK}
  //             />
  //           </View>
  //         </CollapseHeader>
  //         <CollapseBody>
  //           <View style={styles.body}>
  //             <Text style={styles.bodyText}>
  //               {isFrom == 'ReceiptPage' ? item?.desc : item?.answer}
  //             </Text>
  //           </View>
  //         </CollapseBody>
  //       </Collapse>

  //       {listData?.length - 1 == index ? null : (
  //         <View style={styles.seperator} />
  //       )}
  //     </View>
  //   );
  // };

  const renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            paddingTop: index === 0 ? 0 : HEIGHT_12,
            paddingBottom: HEIGHT_16,
          }}
          onPress={() => {
            try {
              LayoutAnimation.configureNext(
                LayoutAnimation?.Presets?.easeInEaseOut
              );
              onItemPress(index);
              if (itemIndex == index) setExpandedIndex(!expandedIndex);
              else setExpandedIndex(true);
              setItemIndex(index);
            } catch (error) {}
          }}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {isFrom == 'ReceiptPage' ? item?.title : item?.question}
              </Text>

              <Icon
                name={
                  index === itemIndex && expandedIndex
                    ? 'chevron-thin-up'
                    : 'chevron-thin-down'
                }
                size={16}
                color={colors.OOREDOO_BLACK}
              />
            </View>
          </View>
          {index === itemIndex && expandedIndex ? (
            <View>
              <View style={styles.body}>
                <Text style={styles.bodyText}>
                  {isFrom == 'ReceiptPage' ? item?.desc : item?.answer}
                </Text>
              </View>
            </View>
          ) : null}
        </TouchableOpacity>

        {listData?.length - 1 == index ? null : (
          <View style={styles.seperator} />
        )}
      </View>
    );
  };

  return (
    <>
      {title && listData ? (
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>{title ? title : ''}</Text>
          </View>

          <View style={styles.listContainer}>
            <FlatList data={listData} renderItem={renderItem} />
          </View>
        </View>
      ) : null}
    </>
  );
};

export default Faqs;

const styles = StyleSheet.create({
  container: {
    marginTop: HEIGHT_30,
    backgroundColor: colors.BG_LIGHT_GREY,
    width: FULL_WIDTH_PERCENTAGE,
    paddingLeft: HORIZONTAL_20,
    paddingRight: HORIZONTAL_14,
    paddingTop: HORIZONTAL_20,
    paddingBottom: HORIZONTAL_30,
  },
  title: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    color: colors.BLACK,
    textAlign: 'left',
    lineHeight: FONT_30,
  },
  listContainer: {
    marginTop: HEIGHT_10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'left',
  },
  headerText: {
    width: WIDTH_280,
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'left',
  },
  body: {
    marginTop: HEIGHT_12,
  },
  bodyText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'left',
  },
  seperator: {
    height: 0.5,
    backgroundColor: colors.BLACK,
    // marginTop: HEIGHT_12,
    // marginBottom: HEIGHT_16,
  },
  opactiy: {
    activeOpacity: 1,
  },
});
