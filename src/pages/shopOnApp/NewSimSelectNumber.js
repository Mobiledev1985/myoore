import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  I18nManager,
  Keyboard,
  Platform,
} from 'react-native';
import {
  TextInput,
  Provider as PaperProvider,
  DefaultTheme,
  Button,
} from 'react-native-paper';

import {
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import NewSimNumberSlider from './NewSimNumberSlider';
import {
  BORDER_RADIUS_15,
  BORDER_RADIUS_3,
  FONT_13,
  FONT_15,
  FONT_16,
  FONT_18,
  FONT_20,
  FONT_21,
  FONT_22,
  FONT_24,
  FONT_30,
  FONT_37,
  FONT_26,
  HEIGHT_110,
  HEIGHT_30,
  HEIGHT_31,
  HORIZONTAL_10,
  HORIZONTAL_13,
  HORIZONTAL_30,
  HORIZONTAL_5,
  HORIZONTAL_8,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_20,
  VERTICAL_30,
  VERTICAL_40,
  WIDTH_110,
  WIDTH_4,
  FONT_28,
} from '../../resources/styles/responsive';
import PageElementSlider from '../../UIComponent/custom/PageElementSlider';
import colors from '../../resources/styles/colors';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {useMutation, useQuery} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {
  SHOP_GETAVAILABLENUMBERS,
  SHOP_SEARCHNUMBERS,
} from '../../resources/route/endpoints';
import {LandingPageButton} from '../../commonHelper/Button';
import {useTranslation} from 'react-i18next';
import ErrorComponent from '../../models/basic/ErrorComponent';
import {getGlobalSettingValue} from '../../services/CommonUtils';

const NewSimSelectNumber = ({
  NewSimSelectNumberComponentData,
  setIsnumberSelect,
  parentProduct,
  childProduct,
  datacompleted,
  setdatacompleted,
  verificationCompleted,
  reloadList,
  setreloadList,
  focusedFun,
  setIsDataFilled,
  searchNumbersList,
  setSearchNumbersList,
  availableNumberList,
  setAvailableNumberList,
  inputText,
  setInputText,
  selindex,
  setselIndex,
  searchStatus,
  setsearchStatus,
  availableStatus,
  setAvailableNumberStatus,
}) => {
  // Define the state variables for the selected category, the search input, and the phone numbers
  const [searchInput, setSearchInput] = useState('');
  const [isAll, isAllSelected] = useState(false);
  const [textinputFocused, settextinputFocused] = useState(false);
  const [error, seterror] = useState('');
  const [isSearch, setIsSearch] = useState(inputText?.length > 2);
  const [buttonDisable, setbuttonDisable] = useState(false);
  const [isTabSwitched, setTabSwitched] = useState(false);
  const {t} = useTranslation();
  const [data, setData] = useState([
    {id: 1, key: 'all', label: 'All'},
    {id: 2, key: 'free', label: 'Free'},
    {id: 3, key: 'special', label: 'Special'},
    {id: 4, key: 'premium', label: 'Premium'},
  ]);
  // const numbercolors = [
  //   {
  //     NORMAL: 'red',
  //     premium: 'grey',
  //     special: 'black',
  //   },
  // ];

  // const numberimages = [
  //   {
  //     NORMAL: 'https://stgapp.ooredoo.com.kw/Content/Images/icons/crown.png',
  //     premium: 'https://stgapp.ooredoo.com.kw/Content/Images/icons/crown.png',
  //     special: 'https://stgapp.ooredoo.com.kw/Content/Images/icons/crown.png',
  //   },
  // ];

  useEffect(() => {
    if (availableNumberList?.length == 0) {
      getAvailablenumbers.mutate();
    }
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS == 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      () => {
        setreloadList('searchnumber');
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS == 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setreloadList(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  function filterNumbers(numberclass, numberslist) {
    // Check if numberclass or numberslist is null, undefined, or empty
    if (
      !numberclass ||
      !numberslist ||
      !numberclass.length ||
      !numberslist.length
    ) {
      return [];
    }

    // Create a map of numberslist objects by classname
    const numbersMap = {};
    for (const number of numberslist) {
      numbersMap[number.classname] = number;
    }

    // Filter numberslist based on numberclass
    const filteredNumbers = [];
    for (const cls of numberclass) {
      if (numbersMap[cls]) {
        filteredNumbers.push(numbersMap[cls]);
      }
    }

    return filteredNumbers;
  }

  // Given numberclass and numberslist variables
  const numberclass =
    childProduct != null && childProduct != undefined && childProduct != ''
      ? childProduct.numberclass
      : parentProduct?.numberclass;

  const numberslist =
    childProduct != null && childProduct != undefined && childProduct != ''
      ? childProduct.numberslist
      : parentProduct?.numberslist;

  // Call the function
  const finaldata = filterNumbers(numberclass, numberslist);

  // const [phoneNumbers, setPhoneNumbers] = useState([
  //   {number: '60336077', category: 'Free', color: '#C4C4C4', icon: null},
  //   {number: '60336055', category: 'Free', color: '#C4C4C4', icon: null},
  //   {number: '60336099', category: 'Special', color: '#FFA500', icon: '￼'},
  //   {number: '60336111', category: 'Special', color: '#FFA500', icon: '￼'},
  //   {number: '60336222', category: 'Premium', color: '#FF0000', icon: '￼'},
  //   {number: '60336333', category: 'Premium', color: '#FF0000', icon: '￼'},
  // ]);

  // const finaldata = finalClass.map(cls => {
  //   return {
  //     class: cls,
  //     color: numbercolors[0][cls],
  //     image: numberimages[0][cls],
  //   };
  // });

  // const responseObj = {
  //   id: '5398',
  //   productid: '5398',
  //   productsku: 'Shamel Pro 25 eShop Exclusive',
  //   productname: 'Shamel Pro 25 eShop Exclusive',
  //   price: '25',
  //   type: 'configurable',
  //   attributesetid: '34',
  //   attributesetname: 'Ooredoo Plans',
  //   shortdesc:
  //     '<ul class="checkmark-list">\r\n<li>5000 Ooredoo minutes</li>\r\n<li>500 Local Minutes</li>\r\n<li>50 GB Internet</li>\r\n<li>1000 Social Media minutes</li>\r\n</ul>',
  //   longdesc:
  //     '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" data-pb-style="BR0K7G1"><div data-content-type="html" data-appearance="default" data-element="main" data-decoded="true"><h3>Included this plan</h3>\r\n<ul>\r\n    <li>5000 Ooredoo minutes</li>\r\n    <li>500 Local Minutes</li>\r\n    <li>50 GB Internet</li>\r\n    <li>1000 Social Media minutes</li>\r\n    <li>Free Delivery</li>\r\n    <li>Free SIM Activation</li>\r\n</ul>\r\n<h3>Exclusive Benefits</h3>\r\n<div class="listing">\r\n    <div class="list">\r\n        <div class="icon"><img src="https://shopqa.ooredoo.com.kw/media/wysiwyg/eshop/ExclusiveBenefits1.png" alt="" /></div>\r\n        <div class="text">\r\n            <strong>Urban Point</strong>\r\n            <p>Proin sodales pulvinar sic tempor.</p>\r\n        </div>\r\n    </div>\r\n    <div class="list">\r\n        <div class="icon"><img src="https://shopqa.ooredoo.com.kw/media/wysiwyg/eshop/ExclusiveBenefits2.png" alt="" /></div>\r\n        <div class="text">\r\n            <strong>Shahid VIP</strong>\r\n            <p>Proin sodales pulvinar sic tempor.</p>\r\n        </div>\r\n    </div>\r\n    <div class="list">\r\n        <div class="icon"><img src="https://shopqa.ooredoo.com.kw/media/wysiwyg/eshop/ExclusiveBenefits3.png" alt="" /></div>\r\n        <div class="text">\r\n            <strong>OSN</strong>\r\n            <p>Proin sodales pulvinar sic tempor.</p>\r\n        </div>\r\n    </div>\r\n    <div class="list">\r\n        <div class="icon"><img src="https://shopqa.ooredoo.com.kw/media/wysiwyg/eshop/ExclusiveBenefits4.png" alt="" /></div>\r\n        <div class="text">\r\n            <strong>Erosnow</strong>\r\n            <p>Proin sodales pulvinar sic tempor.</p>\r\n        </div>\r\n    </div>\r\n    <div class="list">\r\n        <div class="icon"><img src="https://shopqa.ooredoo.com.kw/media/wysiwyg/eshop/ExclusiveBenefits5.png" alt="" /></div>\r\n        <div class="text">\r\n            <strong>Starzplay</strong>\r\n            <p>Proin sodales pulvinar sic tempor.</p>\r\n        </div>\r\n    </div>\r\n</div></div></div></div>',
  //   isdeschtml: 'True',
  //   instock: '1',
  //   stockqty: '0',
  //   linetype: 'Postpaid',
  //   linesubtype: 'Voice',
  //   validity: 'Month',
  //   validityvalue: '30',
  //   additionalbenifits:
  //     '<div class="free_delivery_free_sim new">\r\n<span class="free_delivery">Free Delivery</span>\r\n<span class="free_sim_activation">Free SIM Activation</span>\r\n</div>',
  //   allownewonboarding: '1',
  //   allowmigration: '1',
  //   allowrenewal: '1',
  //   allowportin: '1',
  //   allownumberselection: '0',
  //   numberclass: ['NORMAL', 'Special', 'Premium'],
  //   numberstartingprice: ['0', '0', '0'],
  //   numberendprice: ['1000', '1000', '1000'],
  //   numberpooltype: 'Ooredoo Postpaid Pool',
  //   duetoday: '0',
  //   plancommitment: '',
  //   esimprice: '2.5',
  //   specifications: [
  //     {
  //       label: 'Ooredoo Minutes',
  //       value: '5000 Minutes',
  //     },
  //     {
  //       label: 'Local Minutes',
  //       value: '500 Minutes',
  //     },
  //     {
  //       label: 'Internet',
  //       value: '50 GB',
  //     },
  //     {
  //       label: 'Social Media Minutes',
  //       value: '1000 Minutes',
  //     },
  //     {
  //       label: 'Plan Type',
  //       value: 'Prepaid',
  //     },
  //     {
  //       label: 'Special Benefits',
  //       value:
  //         'FREE for 1 Month, Try and Buy, Eligible for Ooredoo ADD, Earn Nojoom points',
  //     },
  //   ],
  //   specialbenefits:
  //     'FREE for 1 Month, Try and Buy, Eligible for Ooredoo ADD, Earn Nojoom points',
  //   numberofadditionalsim: '0',
  //   allowmanualpaci: '',
  //   documentupload: '1',
  //   simtype: 'Both',
  //   salesoffertitle: '',
  //   saleoffer: '',
  //   baseoldprice: '25',
  //   oldprice: '25',
  //   baseprice: '25',
  //   finalprice: '25',
  //   commitments: [
  //     {
  //       productid: '5397',
  //       label: '24 Months',
  //       sku: 'Shamel Pro 25 - 24 months',
  //       index: '319',
  //       baseoldprice: '25',
  //       oldprice: '25',
  //       baseprice: '25',
  //       finalprice: '25',
  //       tierprices: null,
  //       msrpPrice: '0',
  //       commitmentlabel: 'Get this plan for',
  //       pricelabel: 'KD 25/month',
  //       savelabel: '',
  //       discountlabel: '',
  //     },
  //     {
  //       productid: '5396',
  //       label: '12 Months',
  //       sku: 'Shamel Pro 25 - 12 months',
  //       index: '320',
  //       baseoldprice: '25',
  //       oldprice: '25',
  //       baseprice: '25',
  //       finalprice: '25',
  //       tierprices: null,
  //       msrpPrice: '0',
  //       commitmentlabel: 'Get this plan for',
  //       pricelabel: 'KD 25/month',
  //       savelabel: '',
  //       discountlabel: '',
  //     },
  //     {
  //       productid: null,
  //       label: 'None',
  //       sku: null,
  //       index: '321',
  //       baseoldprice: null,
  //       oldprice: null,
  //       baseprice: null,
  //       finalprice: null,
  //       tierprices: null,
  //       msrpPrice: null,
  //       commitmentlabel: null,
  //       pricelabel: null,
  //       savelabel: null,
  //       discountlabel: null,
  //     },
  //   ],
  //   template: 'KD <%- data.price %>',
  //   currencyformat: 'KD %s',
  //   priceformat: {
  //     pattern: 'KD %s',
  //     precision: '3',
  //     requiredprecision: '3',
  //     decimalsymbol: '.',
  //     groupsymbol: ',',
  //     grouplength: '3',
  //     integerrequired: 'False',
  //   },
  //   choosetext: 'Choose an Option...',
  //   candisplayshowoutofstockstatus: 'False',
  //   saleschannelcode: 'ooredoo_b2b_shop',
  //   fullactionname: 'ooredooapi_api_productdetail',
  //   choosecommitmenttext: 'Choose Commitments',
  //   continuebtn: 'Continue',
  // };

  React.useEffect(() => {
    try {
      verificationCompleted({
        transaction: false,
        res: {},
        type: 'onboarding',
      });
      //   if (
      //     global.NewSimNumberSliderItem == null ||
      //     global.NewSimNumberSliderItem == undefined ||
      //     global.NewSimNumberSliderItem == ''
      //   ) {
      //     global.NewSimNumberSliderItem = null;
      //     setdatacompleted(prevState => ({
      //       ...prevState,
      //       selectnumber: false,
      //     }));
      //     setIsnumberSelect(false);
      //     setIsDataFilled(false);
      //     getAvailablenumbers.refetch();
      //   }
    } catch (error) {}
  }, [selindex]);
  // const getAvailablenumbers = useQuery(
  //   [
  //     {},
  //     SHOP_GETAVAILABLENUMBERS,
  //     {
  //       startingprice:
  //         childProduct != null &&
  //         childProduct != undefined &&
  //         childProduct != ''
  //           ? childProduct?.numberstartingprice[selindex]
  //           : parentProduct?.numberstartingprice[selindex],
  //       classname:
  //         childProduct != null &&
  //         childProduct != undefined &&
  //         childProduct != ''
  //           ? childProduct?.numberclass[selindex]
  //           : parentProduct?.numberclass[selindex],
  //       endprice:
  //         childProduct != null &&
  //         childProduct != undefined &&
  //         childProduct != ''
  //           ? childProduct?.numberendprice[selindex]
  //           : parentProduct?.numberendprice[selindex],
  //       resultrange:
  //         getGlobalSettingValue('shopnumbersrange') != null &&
  //         getGlobalSettingValue('shopnumbersrange') != undefined &&
  //         getGlobalSettingValue('shopnumbersrange') != ''
  //           ? getGlobalSettingValue('shopnumbersrange')
  //           : '10',
  //       pooltype:
  //         childProduct != null &&
  //         childProduct != undefined &&
  //         childProduct != ''
  //           ? childProduct?.numberpooltype
  //           : parentProduct?.numberpooltype,
  //       linetype:
  //         childProduct != '' &&
  //         childProduct != null &&
  //         childProduct != undefined
  //           ? childProduct?.linetype
  //           : parentProduct?.linetype,
  //     },
  //     {},
  //   ],
  //   {
  //     enabled:
  //       global.NewSimNumberSliderItem == null ||
  //       global.NewSimNumberSliderItem == undefined ||
  //       global.NewSimNumberSliderItem == ''
  //         ? true
  //         : false,
  //     retry: false,
  //     onSuccess: (udata, variables, context) => {
  //       setAvailableNumberList(udata?.data?.response?.Numbers);
  //       setAvailableNumberStatus(udata?.data?.status);
  //     },
  //     onError: (uerror, variables, context) => {},
  //   }
  // );

  const getAvailablenumbers = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SHOP_GETAVAILABLENUMBERS,
          {
            startingprice:
              childProduct != null &&
              childProduct != undefined &&
              childProduct != ''
                ? childProduct?.numberstartingprice[selindex]
                : parentProduct?.numberstartingprice[selindex],
            classname:
              childProduct != null &&
              childProduct != undefined &&
              childProduct != ''
                ? childProduct?.numberclass[selindex]
                : parentProduct?.numberclass[selindex],
            endprice:
              childProduct != null &&
              childProduct != undefined &&
              childProduct != ''
                ? childProduct?.numberendprice[selindex]
                : parentProduct?.numberendprice[selindex],
            resultrange:
              getGlobalSettingValue('shopnumbersrange') != null &&
              getGlobalSettingValue('shopnumbersrange') != undefined &&
              getGlobalSettingValue('shopnumbersrange') != ''
                ? getGlobalSettingValue('shopnumbersrange')
                : '10',
            pooltype:
              childProduct != null &&
              childProduct != undefined &&
              childProduct != ''
                ? childProduct?.numberpooltype
                : parentProduct?.numberpooltype,
            linetype:
              childProduct != '' &&
              childProduct != null &&
              childProduct != undefined
                ? childProduct?.linetype
                : parentProduct?.linetype,
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        setAvailableNumberList(udata?.data?.response?.Numbers);
        setAvailableNumberStatus(udata?.data?.status);
      },
      onError: (error, variables, context) => {},
    }
  );

  const getSearchnumbers = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SHOP_SEARCHNUMBERS,
          {
            startingprice:
              childProduct != null &&
              childProduct != undefined &&
              childProduct != ''
                ? childProduct?.numberstartingprice[selindex]
                : parentProduct?.numberstartingprice[selindex],
            classname:
              childProduct != null &&
              childProduct != undefined &&
              childProduct != ''
                ? childProduct?.numberclass[selindex]
                : parentProduct?.numberclass[selindex],
            endprice:
              childProduct != null &&
              childProduct != undefined &&
              childProduct != ''
                ? childProduct?.numberendprice[selindex]
                : parentProduct?.numberendprice[selindex],
            resultrange:
              getGlobalSettingValue('shopnumberssearchrange') != null &&
              getGlobalSettingValue('shopnumberssearchrange') != undefined &&
              getGlobalSettingValue('shopnumberssearchrange') != ''
                ? getGlobalSettingValue('shopnumberssearchrange')
                : '10',
            querypattern: inputText,
            pooltype:
              childProduct != null &&
              childProduct != undefined &&
              childProduct != ''
                ? childProduct?.numberpooltype
                : parentProduct?.numberpooltype,
            linetype:
              childProduct != '' &&
              childProduct != null &&
              childProduct != undefined
                ? childProduct?.linetype
                : parentProduct?.linetype,
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        setbuttonDisable(false);
        try {
          seterror('');
          setSearchNumbersList(udata);
          // if (udata?.data?.status === '0') {
          setsearchStatus(udata?.data?.status);
          // }
          // if (udata?.data?.status === '0') {
          // setSearchNumbersList(udata?.data?.response?.Numbers);
          // }
        } catch (e) {}
      },
      onError: (uerror, variables, context) => {
        setbuttonDisable(false);
      },
    }
  );
  // const handleCategorySelection = item => {
  //   // Update the selected item and set its enable property to true
  //   // setSelectedItem(item.id);
  //   const updatedData = data.map(dataItem => {
  //     if (dataItem.id === item.id) {
  //       return { ...dataItem, enable: true };
  //     } else {
  //       return { ...dataItem, enable: false };
  //     }
  //   });
  //   // Update the state with the modified data
  //   setData(updatedData);
  // };

  // Define a function to handle the search input change
  const handleSearchInputChange = text => {
    setSearchInput(text);
  };

  // // Define a function to filter the phone numbers based on the selected category and the search input
  // const filterPhoneNumbers = () => {
  //   return phoneNumbers.filter((phoneNumber) => {
  //     // Check if the phone number matches the selected category or the category is "All"
  //     const categoryMatch =
  //       phoneNumber.category === selectedCategory || selectedCategory === "All";
  //     // Check if the phone number contains the search input or the search input is empty
  //     const searchMatch =
  //       phoneNumber.number.includes(searchInput) || searchInput === "";
  //     // Return true if both conditions are met
  //     return categoryMatch && searchMatch;
  //   });
  // };

  // // Define a function to render each phone number item in the flat list
  // const renderPhoneNumberItem = ({ item }) => {
  //   return (
  //     <View style={[styles.phoneNumberItem, { backgroundColor: item.color }]}>
  //       <Text style={styles.phoneNumberText}>{item.number}</Text>
  //       {item.icon && <Text style={styles.phoneNumberIcon}>{item.icon}</Text>}
  //     </View>
  //   );
  // };

  // Define a function to render the category buttons
  // const renderCategoryButton = (category) => {
  //   // Check if the category is the selected one
  //   const isSelected = category === selectedCategory;
  //   // Return a touchable opacity component with the category name and a radio button
  //   return (
  //     <TouchableOpacity
  //       style={styles.categoryButton}
  //       onPress={() => handleCategorySelection(category)}
  //     >
  //       <View
  //         style={[
  //           styles.radioButton,
  //           // Change the border color and the background color based on the selection
  //           {
  //             borderColor: isSelected ? "#000000" : "#C4C4C4",
  //             backgroundColor: isSelected ? "#000000" : "#FFFFFF",
  //           },
  //         ]}
  //       />
  //     <Text style={styles.categoryText}>{category}</Text>

  //     </TouchableOpacity>
  //   );
  // };

  // const renderItem = ({ item }) => (
  //   <TouchableOpacity
  //   onPress={() => handleCategorySelection(item)}
  //     style={[styles.button]}

  //   >
  //     {item.key === 'special' && <Text style={styles.star}>★</Text>}
  //     {item.key === 'premium' && <Text style={styles.crown}>★</Text>}
  //     <Text>{item.label}</Text>
  //   </TouchableOpacity>
  // );

  const onSearchPress = () => {
    let searchedList = availableNumberList?.filter(item => {
      return item?.MSISDN?.includes(inputText);
    });
    if (searchedList?.length > 0) {
      setsearchStatus('0');
      setSearchNumbersList({data: {response: {Numbers: searchedList}}});
    } else {
      setbuttonDisable(true);
      setsearchStatus(null);
      getSearchnumbers.mutate();
    }
  };

  const onselected = () => {
    try {
      setTabSwitched(true);
      setTimeout(() => {
        setTabSwitched(false);
      }, 300);
      setIsSearch(false);
      setInputText('');
      global.NewSimNumberSliderItem = null;
      setdatacompleted(prevState => ({
        ...prevState,
        selectnumber: false,
      }));
      setSearchNumbersList([]);
      setIsnumberSelect(false);
      setIsDataFilled(false);
      getAvailablenumbers.mutate();
    } catch (error) {}
  };
  return (
    <View style={styles.container}>
      {/* <View style={styles.body}> */}
      <PageElementSlider
        itemlist={finaldata}
        isAll={isAll}
        addall={false}
        isAllSelected={isAllSelected}
        flag={'newsimorder'}
        selindex={selindex}
        setselIndex={setselIndex}
        onselected={onselected}
      />
      {/* <View style={styles.searchContainer}> */}
      <View style={{marginHorizontal: HORIZONTAL_13}}>
        <TextInput
          label={
            <Text
              style={{
                fontFamily: RUBIK_LIGHT_FONT,
                fontWeight: '300',
                fontSize: FONT_13,
              }}>
              {NewSimSelectNumberComponentData?.search_enter_3digits_text}
            </Text>
          }
          mode="outlined"
          value={inputText}
          keyboardType={'numeric'}
          returnKeyType="done"
          onFocus={() => {
            focusedFun('onboarding');
          }}
          onChangeText={text => {
            if (text.length > 2 || text.length == 0) {
              seterror('');
              setsearchStatus(0);
              setIsSearch(false);
            }
            setInputText(
              text.replace(
                /[`\D~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'",.<> \{\}\[\]\\\/]/g,
                ''
              )
            );
          }}
          style={styles.input}
          maxLength={8}
          theme={{
            colors: {
              placeholder:
                textinputFocused || inputText?.length != 0
                  ? error == ''
                    ? colors.OOREDDO_GREY
                    : colors.OOREDOO_RED
                  : colors.OOREDDO_GREY,
              text: colors.BLACK,
              primary: error == '' ? colors.OOREDDO_GREY : colors.OOREDOO_RED,
              underlineColor: 'transparent',
              background:
                textinputFocused || inputText?.length != 0
                  ? colors.OOREDOO_RED
                  : colors.OOREDDO_GREY,
            },
            fonts: {
              regular: {
                fontFamily: RUBIK_REGULAR_FONT,
                fontSize: FONT_16,
                fontWeight: '400',
              },
            },
          }}
          onFocus={() => {
            focusedFun('selectnumber');
            settextinputFocused(true);
          }}
          onBlur={() => {
            if (inputText?.length === 0) {
              settextinputFocused(false);
            } else {
              settextinputFocused(true);
            }
          }}
          // right={
          //   <TextInput.Icon
          //     name=""
          //     onPress={() => {}}
          //     style={{
          //       height: HEIGHT_30,
          //       width: WIDTH_110,
          //       right: WIDTH_110 / 3,
          //     }}
          //   />
          // }
        />

        {textinputFocused || inputText?.length != 0 ? (
          <View
            style={{
              justifyContent: 'center',
              position: 'absolute',
              alignSelf: 'flex-end',
              right: isTablet ? WIDTH_4 : 0,
              height: heightPixel(50),
              width: widthPixel(120),
              zIndex: 999999,
            }}>
            <LandingPageButton
              title={t('search')}
              disabled={buttonDisable ? true : false}
              onPress={() => {
                if (inputText?.length < 3) {
                  seterror(t('peavmn'));
                } else {
                  Keyboard.dismiss();
                  seterror(t(''));
                  setIsSearch(true);
                  onSearchPress();
                }
              }}
              customStyle={
                inputText?.length > 2
                  ? buttonDisable
                    ? styles.disabletryagainBtnContainerside
                    : styles.tryagainBtnContainerside
                  : styles.disabletryagainBtnContainerside
              }
              customTextStyle={
                inputText?.length > 2
                  ? buttonDisable
                    ? styles.disabletryagainBtnText
                    : styles.tryagainBtnText
                  : styles.disabletryagainBtnText
              }
            />
          </View>
        ) : (
          <></>
        )}
        <View
          style={{
            height: heightPixel(25),
            justifyContent: 'center',
          }}>
          {error != null && error != undefined && error != '' ? (
            <Text style={styles.errorMesssage}>{error}</Text>
          ) : null}
        </View>
        {/* <TextInput
          style={styles.searchInput}
          placeholder="Enter min 3 digits to search"
        /> */}
        {/* </View>  */}
        <View>
          <NewSimNumberSlider
            setIsnumberSelect={setIsnumberSelect}
            status={isSearch ? searchStatus : availableStatus}
            datacompleted={datacompleted}
            setdatacompleted={setdatacompleted}
            numberList={
              isSearch
                ? searchNumbersList?.data?.response?.Numbers
                : availableNumberList
            }
            childProduct={childProduct}
            parentProduct={parentProduct}
            selindex={selindex}
            setIsDataFilled={setIsDataFilled}
            isTabSwitched={isTabSwitched}
          />
        </View>
      </View>

      {/* <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        // contentContainerStyle={styles.buttonContainer}
        renderItem={renderItem}
      /> */}
      {/* <View style={styles.buttonContainer}>
        <Text style={styles.allButton}>All</Text>
        <Text style={styles.freeButton}>Free</Text>
        <Text style={styles.specialButton}>
          <Text style={styles.star}>★</Text>Special
        </Text>
        <Text style={styles.premiumButton}>
          <Text style={styles.crown}>★</Text>Premium
        </Text>
      </View> */}
      {/* <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter min 3 digits to search"
        />
      </View> */}
      {/* </View> */}
      {/* <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter min 3 digits to search"
            value={searchInput}
            onChangeText={handleSearchInputChange}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View> */}
      {/* <View style={styles.listSection}> */}

      {/* <FlatList
            data={filterPhoneNumbers()}
            renderItem={renderPhoneNumberItem}
            keyExtractor={(item) => item.number}
          /> */}
      {/* </View> */}
      {/* </View> */}
    </View>
  );
};

// Define the styles for the app components
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor:'green'
    // backgroundColor: "#FFFFFF",
  },
  header: {
    flex: 1,
    // backgroundColor: "#FF0000",
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: "#FFFFFF",
  },
  body: {
    flex: 1,
    padding: 16,
    marginTop: 50,
    backgroundColor: 'green',
  },
  categorySection: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  categoryButtons: {
    // flexDirection: "row",
    justifyContent: 'space-between',
    //alignItems: "center",
    marginTop: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    // justifyContent: "center",
    // alignItems: "center",
  },
  categoryText: {
    fontSize: 16,
    color: '#000000',
    marginRight: 8,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  searchInput: {
    flex: 4,
    height: heightPixel(50),
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    fontSize: 16,
    color: '#000000',
  },
  searchButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listSection: {
    flex: 6,
    marginTop: 16,
  },
  phoneNumberItem: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  phoneNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  phoneNumberIcon: {
    fontSize: 16,
    color: '#000000',
  },
  filtercontainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 40,
    flex: 0.1,
  },
  allButton: {
    backgroundColor: '#f00',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  freeButton: {
    borderColor: '#f00',
    borderWidth: 1,
    color: '#f00',
    padding: 10,
    borderRadius: 10,
  },
  specialButton: {
    borderColor: '#f00',
    borderWidth: 1,
    color: '#f00',
    padding: 10,
    borderRadius: 10,
  },

  premiumButton: {
    borderColor: '#ff0',
    borderWidth: 1,
    color: '#ff0',
    padding: 10,
    borderRadius: 10,
  },

  searchContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    // marginVertical: 10,
  },
  button: {
    //padding: 10,
    borderRadius: 31,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPixel(82),
    height: HEIGHT_31,
  },
  star: {
    fontSize: 16,
    marginRight: 5,
  },
  crown: {
    fontSize: 16,
    marginRight: 5,
  },
  input: {
    width: isTablet
      ? SCREEN_WIDTH / 1.23 - widthPixel(60)
      : SCREEN_WIDTH - widthPixel(60),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: I18nManager.isRTL ? FONT_37 : FONT_28,
  },
  tryagainBtnText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_22 : FONT_15,
    color: colors.WHITE,
    // marginVertical: VERTICAL_5,
  },
  tryagainBtnContainerside: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_15,
    width: WIDTH_110,
    height: HEIGHT_30,
    right: HORIZONTAL_10,
    top: heightPixel(6),
  },
  disabletryagainBtnText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_22 : FONT_15,
    color: colors.WHITE,
    // marginVertical: VERTICAL_5,
  },
  disabletryagainBtnContainerside: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.OOREDDO_LIGHT_GREY,
    borderRadius: BORDER_RADIUS_15,
    width: WIDTH_110,
    height: HEIGHT_30,
    right: HORIZONTAL_10,
    top: heightPixel(6),
  },
  errorMesssage: {
    flexDirection: 'row',
    textAlign: 'left',
    fontSize: FONT_13,
    lineHeight: FONT_21,
    marginStart: HORIZONTAL_5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    color: colors.OOREDOO_RED,
    fontFamily: RUBIK_LIGHT_FONT,
  },
});

export default NewSimSelectNumber;
