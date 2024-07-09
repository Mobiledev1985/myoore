import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  I18nManager,
  Image,
} from 'react-native';
import {heightPixel} from '../../resources/styles/normalizedimension';
import {
  FONT_14,
  HEIGHT_16,
  HORIZONTAL_13,
  HORIZONTAL_15,
  HORIZONTAL_20,
  VERTICAL_10,
  VERTICAL_20,
  VERTICAL_5,
  WIDTH_16,
} from '../../resources/styles/responsive';
import NewSimSelectNumber from './NewSimSelectNumber';
import NewSimMigrationCategory from './NewSimMigrationCategory';
import NewSimPortInCategory from './NewSimPortInCategory';
import SwitchCategoryConfirmation from '../../components/shopOnApp/SwitchCategoryConfirmation';
import {
  RUBIK_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import ImageComponent from '../../models/basic/ImageComponent';

const UNSELECT_SIM_BUTTON = require('../../assets/newsimbutton.png');
const SELECT_SIM_BUTTON = require('../../assets/o2.png');

const NewSimCategoryButton = ({
  clickRadioButton,
  NewSimSelectNumberComponentData,
  setIsnumberSelect,
  parentProduct,
  childProduct,
  datacompleted,
  setdatacompleted,
  focusedFun,
  verificationCompleted,
  reloadList,
  setreloadList,
  setPortInOption,
  portInOption,
  setIsTNCAccepted,
  isTNCAccepted,
  enteredNumberRes,
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
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState('');
  const [isDataFilled, setIsDataFilled] = useState(false);
  const [isConfirmPopUp, setIsConfirmPopUp] = useState(false);
  const [selectedRadioItem, setSelectedRadioItem] = useState(null);
  const [selectedRadioIndex, setSelectedRadioIndex] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      name: NewSimSelectNumberComponentData?.choose_your_number,
      enable: false,
      type: 'valueone',
      onboardingtype: 'onboarding',
      visible:
        childProduct != null && childProduct != undefined && childProduct != ''
          ? childProduct?.allownewonboarding != null &&
            childProduct?.allownewonboarding != undefined &&
            childProduct?.allownewonboarding != '' &&
            childProduct?.allownewonboarding == '1'
            ? true
            : false
          : parentProduct != null &&
            parentProduct != undefined &&
            parentProduct != ''
          ? parentProduct?.allownewonboarding != null &&
            parentProduct?.allownewonboarding != undefined &&
            parentProduct?.allownewonboarding != '' &&
            parentProduct?.allownewonboarding == '1'
            ? true
            : false
          : false,
    },
    {
      id: 2,
      name: NewSimSelectNumberComponentData?.choose_existing_number,
      enable: false,
      type: 'valuetwo',
      onboardingtype: 'migration',
      visible:
        childProduct != null && childProduct != undefined && childProduct != ''
          ? childProduct?.allowmigration != null &&
            childProduct?.allowmigration != undefined &&
            childProduct?.allowmigration != '' &&
            childProduct?.allowmigration == '1'
            ? true
            : false
          : parentProduct != null &&
            parentProduct != undefined &&
            parentProduct != ''
          ? parentProduct?.allowmigration != null &&
            parentProduct?.allowmigration != undefined &&
            parentProduct?.allowmigration != '' &&
            parentProduct?.allowmigration == '1'
            ? true
            : false
          : false,
    },
    {
      id: 3,
      name: NewSimSelectNumberComponentData?.switch_ooredoo_number,
      enable: false,
      type: 'valuethree',
      onboardingtype: 'portin',
      visible:
        childProduct != null && childProduct != undefined && childProduct != ''
          ? childProduct?.allowportin != null &&
            childProduct?.allowportin != undefined &&
            childProduct?.allowportin != '' &&
            childProduct?.allowportin == '1'
            ? true
            : false
          : parentProduct != null &&
            parentProduct != undefined &&
            parentProduct != ''
          ? parentProduct?.allowportin != null &&
            parentProduct?.allowportin != undefined &&
            parentProduct?.allowportin != '' &&
            parentProduct?.allowportin == '1'
            ? true
            : false
          : false,
    },
  ]);

  // const data = [
  //   { id: 1, name: I18nManager.isRTL ? 'Select a new number' : 'Select a new number', enable:false},
  //   { id: 2, name: I18nManager.isRTL ? 'Use my existing number':'Use my existing number', enable:false, },
  //   { id: 3, name: I18nManager.isRTL ? 'Recommend a Number' : 'Recommend a Number',enable:false},
  // ];

  React.useEffect(() => {
    if (
      global.NewSimNumberSliderItem != null &&
      global.NewSimNumberSliderItem != undefined &&
      global.NewSimNumberSliderItem != ''
    ) {
      setSelectedItemIndex(0);
      try {
        handleCategorySelection({
          id: 1,
          name: NewSimSelectNumberComponentData?.choose_your_number,
          enable: false,
          type: 'valueone',
          onboardingtype: 'onboarding',
        });
      } catch (e) {}
    }
  }, []);

  const handleCategorySelection = (item, index) => {
    // Update the selected item and set its enable property to true
    if (selectedItemIndex === index) {
      // Index is already selected, do nothing
      return;
    }
    setSelectedItemIndex(index);
    clickRadioButton(item.id, item);
    setSelectedItem(item.id);
    const updatedData = data.map(dataItem => {
      if (dataItem.id === item.id) {
        return {...dataItem, enable: true};
      } else {
        return {...dataItem, enable: false};
      }
    });
    // Update the state with the modified data
    setData(updatedData);
  };

  // Define a function to render the category buttons
  const renderCategoryButton = ({item, index}) => {
    // Check if the category is the selected one
    const isSelected = item.id === selectedItem;
    // Return a touchable opacity component with the category name and a radio button
    return (
      <>
        {item?.visible && (
          <>
            <TouchableOpacity
              style={styles.categoryButton}
              disabled={isSelected}
              onPress={() => {
                if (item.type == 'valuetwo' || item.type == 'valuethree') {
                  global.NewSimNumberSliderItem = null;
                  focusedFun('selectnumber' + item.type);
                } else {
                  focusedFun('selectnumber');
                }
                if (
                  isDataFilled &&
                  (datacompleted?.selectnumber === true ||
                    enteredNumberRes?.transaction)
                ) {
                  setIsConfirmPopUp(true);
                  setSelectedRadioItem(item);
                  setSelectedRadioIndex(index);
                } else {
                  handleCategorySelection(item, index);
                }
              }}>
              <ImageComponent
                type="image"
                iwidth={WIDTH_16}
                iheight={WIDTH_16}
                source={
                  isSelected
                    ? NewSimSelectNumberComponentData?.radio_button_check_icon
                    : NewSimSelectNumberComponentData?.radio_button_uncheck_icon
                }
                resizeMode={'contain'}
              />
              {/* <View
            style={[
              styles.radioButton,
              // Change the border color and the background color based on the selection
              {
                borderColor: isSelected ? "#000000" : "#C4C4C4",
                backgroundColor: isSelected ? "#000000" : "#FFFFFF",
              },
            ]}
          /> */}
              <Text
                style={[
                  styles.categoryText,
                  {
                    fontFamily: isSelected
                      ? RUBIK_SEMIBOLD_FONT
                      : RUBIK_REGULAR_FONT,
                  },
                ]}>
                {item?.name}
              </Text>
            </TouchableOpacity>
            {item.enable && (
              <View>
                {/* Render content below the selected item */}
                {item.type === 'valueone' ? (
                  <View
                    style={{
                      marginBottom: VERTICAL_20,
                    }}>
                    <NewSimSelectNumber
                      NewSimSelectNumberComponentData={
                        NewSimSelectNumberComponentData
                      }
                      setIsnumberSelect={setIsnumberSelect}
                      parentProduct={parentProduct}
                      childProduct={childProduct}
                      datacompleted={datacompleted}
                      setdatacompleted={setdatacompleted}
                      verificationCompleted={verificationCompleted}
                      reloadList={reloadList}
                      setreloadList={setreloadList}
                      focusedFun={focusedFun}
                      setIsDataFilled={setIsDataFilled}
                      searchNumbersList={searchNumbersList}
                      setSearchNumbersList={setSearchNumbersList}
                      availableNumberList={availableNumberList}
                      setAvailableNumberList={setAvailableNumberList}
                      inputText={inputText}
                      setInputText={setInputText}
                      selindex={selindex}
                      setselIndex={setselIndex}
                      searchStatus={searchStatus}
                      setsearchStatus={setsearchStatus}
                      availableStatus={availableStatus}
                      setAvailableNumberStatus={setAvailableNumberStatus}
                    />
                  </View>
                ) : item.type === 'valuetwo' ? (
                  <View>
                    <NewSimMigrationCategory
                      parentProduct={parentProduct}
                      datacompleted={datacompleted}
                      setdatacompleted={setdatacompleted}
                      childProduct={childProduct}
                      verificationCompleted={verificationCompleted}
                      focusedFun={focusedFun}
                      setIsDataFilled={setIsDataFilled}
                    />
                  </View>
                ) : item.type === 'valuethree' ? (
                  <View>
                    <NewSimPortInCategory
                      parentProduct={parentProduct}
                      datacompleted={datacompleted}
                      setdatacompleted={setdatacompleted}
                      childProduct={childProduct}
                      verificationCompleted={verificationCompleted}
                      setPortInOption={setPortInOption}
                      portInOption={portInOption}
                      setIsTNCAccepted={setIsTNCAccepted}
                      isTNCAccepted={isTNCAccepted}
                      focusedFun={focusedFun}
                      setIsDataFilled={setIsDataFilled}
                    />
                  </View>
                ) : (
                  <Text style={{marginHorizontal: HORIZONTAL_20}}>{''}</Text>
                )}
                {/* Add more conditions based on other types if needed */}
              </View>
            )}
          </>
        )}
      </>
    );
  };

  // Return the JSX code for the app layout
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCategoryButton}
      />
      <SwitchCategoryConfirmation
        visible={isConfirmPopUp}
        NewSimSelectNumberComponentData={NewSimSelectNumberComponentData}
        onClose={() => {
          setIsConfirmPopUp(false);
          setSelectedRadioItem(null);
          setSelectedRadioIndex(null);
        }}
        onConfirm={() => {
          setIsConfirmPopUp(false);
          handleCategorySelection(selectedRadioItem, selectedRadioIndex);
          setIsDataFilled(false);
          global.NewSimNumberSliderItem = null;
          setSearchNumbersList([]);
          setAvailableNumberList([]);
          setInputText('');
          setselIndex(0);
          setsearchStatus(0);
          setAvailableNumberStatus(0);
          setdatacompleted(prevState => ({
            ...prevState,
            selectnumber: false,
          }));
        }}
      />
    </View>
  );
};

// Define the styles for the app components
const styles = StyleSheet.create({
  container: {
    // marginTop: VERTICAL_10,
    // marginHorizontal: HORIZONTAL_13,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: HORIZONTAL_15,
    // marginTop: VERTICAL_5,
    marginHorizontal: HORIZONTAL_13,
  },
  categoryText: {
    fontSize: FONT_14,
    color: '#221E20',
    marginHorizontal: HORIZONTAL_13,
  },
  radioButton: {
    width: WIDTH_16,
    height: HEIGHT_16,
    // borderRadius: 8,
    // borderWidth: 2,
  },
});

export default NewSimCategoryButton;
