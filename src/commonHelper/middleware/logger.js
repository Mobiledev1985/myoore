import {logger, fileAsyncTransport} from 'react-native-logs';
import RNFS from 'react-native-fs';

/* EXPO:
 * import * as FileSystem from 'expo-file-system';
 */

let today = new Date();
let date = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

const config = {
  severity: 'debug',
  transport: fileAsyncTransport,
  transportOptions: {
    FS: RNFS,
    filePath: RNFS.DownloadDirectoryPath,
    fileName: `${global.UniqueToken}_logs_${date}-${month}-${year}.txt`, // Create a new file every day
  },
};

export const logs = logger.createLogger(config);
