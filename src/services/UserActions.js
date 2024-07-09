import ScreenName from '../navigator/ScreenName';
import {useMutation, useQuery} from 'react-query';

import {
  DigiserviceActivate,
  DigitalServicesData,
} from '../resources/route/endpoints';
import {consoleLog} from '../commonHelper/utils';
import {callQueryapi} from '../commonHelper/middleware/callapi';

export const BuyDigitalServices = (navigation, item) => {
  let _data = JSON.parse(JSON.stringify(DigiserviceActivate.data));
  _data.id = item?.offerid;
  _data.planid = item?.planid;
  _data.servicenode = item?.servicenode;
  _data.servicetype = item?.servicetype;
  _data.price = item?.price;
  let _req = {
    endpoint: DigiserviceActivate.url,
    param: _data,
    key: 'activateservice_' + new Date().getTime() + '_' + _data.id,
    header: {},
  };

  return callQueryapi({
    queryKey: [_req.key, _req.endpoint, _req.param],
  });
};
export const ActivateServiceResponse = (navigation, resp, error, item) => {
  try {
    if (resp != null && resp.status == '0') {
      navigation.navigate(ScreenName.TransStatus, {
        type: 1,
        status: resp.code,
        message: resp.message,
        closescreen: ScreenName.DigitalServiceHome,
        survey: resp.survey,
        paytype: 'digitalservices',
        statusCode: 'success',
        showShare: item?.share?.showshareicon,
        share: item?.share,
        quest: resp?.quest,
        offerdata_:item
      });
    } else {
      navigation.navigate(ScreenName.ActivationFailure, {
        type: 1,
        status: 0,
        message: resp.message,
        closescreen: ScreenName.DigitalServiceHome,
        survey: resp.survey,
        paytype: 'digitalservices',
        statusCode: 'success',
      });
    }
  } catch (e) {}
};
