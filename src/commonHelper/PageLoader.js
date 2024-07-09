import React from 'react';
import {Modal, View, ActivityIndicator} from 'react-native';

import colors from '../resources/styles/colors';
import {HEIGHT_200} from '../resources/styles/responsive';
var _timer = null;

class PageLoader extends React.PureComponent {
  animatedValue = [];

  constructor(props) {
    super(props);
    this.state = {isVisible: true};
  }
  componentDidMount() {
    if (this.props.shouldDismissManual) {
      _timer = setTimeout(() => {
        this.setState({isVisible: false});
      }, this.props.seconds);
    }
  }
  componentWillUnmount() {
    if (_timer != null) {
      clearTimeout(_timer);
    }
  }

  render() {
    return (
      <View>
        <Modal
          statusBarTranslucent
          transparent
          visible={this.props.isVisible && this.state.isVisible}>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 1,
                minHeight: HEIGHT_200,
              }}>
              {this.props.showloader && (
                <ActivityIndicator size="large" color={colors.OOREDOO_RED} />
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default PageLoader;
