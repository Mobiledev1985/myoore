import {logEvents, screenRecordEvent, setUserProperty} from './ClevetapService';
import crashlytics from '@react-native-firebase/crashlytics';
export {RecordlogEvents, LogActions, RecordScreenEvent, setRecordUserProperty};
const LogActions = (action, title) => {
  try {
  } catch (e) {}
};
const RecordScreenEvent = pagename => {
  try {
    crashlytics().log(pagename);
  } catch (e) {}
  try {
    let _current = global.currentpage;
    if (_current != pagename || global.currentpage == undefined) {
      global.previouspage = _current;
      global.currentpage = pagename;
      screenRecordEvent(pagename);
    }
  } catch (e) {}
};

const RecordlogEvents = (eventname, obj) => {
  try {
    logEvents(eventname, obj);
  } catch (e) {}
};

const setRecordUserProperty = ({
  email,
  name,
  ContractID,
  mobileNo,
  isdigital,
  rateplantype,
  custtype,
  language,
  voiceline,
}) => {
  try {
    setUserProperty({
      email,
      name,
      ContractID,
      mobileNo,
      isdigital,
      rateplantype,
      custtype,
      language,
      voiceline,
    });
  } catch (e) {}
};
