import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { getErrorFromJson, showError } from './Errors';
import PlatformEnum from '../enums/PlatformEnum';

export function downloadAndOpenFile(file) {
    const dirs = RNFetchBlob.fs.dirs;
    const android = RNFetchBlob.android;

    const fileExt = file.name.slice((file.name.lastIndexOf('.') - 1 >>> 0) + 2);
    const fileName = file.name.slice(0, file.name.lastIndexOf('.') >>> 0);
    const fileNewName = `${fileName}-${Date.now()}${fileExt ? `.${fileExt}` : ''}`;

    RNFetchBlob.config({
        addAndroidDownloads: {
            title: fileNewName,
            useDownloadManager: true,
            mediaScannable: true,
            notification: true,
            path: `${dirs.DownloadDir}/${fileNewName}`,
        },
    })
    .fetch('GET', file.url)
    .then((res) => {
        android.actionViewIntent(res.path(), file.content_type)
            .catch((err) => console.log(err));
    })
    .catch((err) => showError(err));
}

export function requestAlpinebook(url, onOk, onFail, resultModifier) {
    const baseUrl = 'https://913851d7.ngrok.io/';
    const apiUrl = `${baseUrl}api/v1/`;
    const requestUrl = `${apiUrl}${url}`;

    const platform = Platform.select({
        [PlatformEnum.IOS]: 'iOS',
        [PlatformEnum.ANDROID]: 'Android'
    });
    fetch(requestUrl, { headers: { 'User-Agent': `Alpinebook ${platform} v0.01` } })
        .then((response) => {
            const contentType = response.headers.get('Content-Type') || '';
            const isJson = contentType.includes('application/json');
            let invalidContentType = false;

            if (response.ok) {
                if (isJson) {
                    response.json().then((responseJson) => {
                        let result = responseJson;
                        if (resultModifier) {
                            result = resultModifier(responseJson);
                        }
                        onOk(result);
                    });
                } else {
                    invalidContentType = true;
                }
            } else if (isJson) {
                response.json().then((responseJson) => {
                    if (onFail) {
                        onFail(responseJson);
                    }
                    showError(getErrorFromJson(responseJson));
                });
            } else {
                invalidContentType = true;
            }

            if (invalidContentType) {
                return Promise.reject(new Error(`Invalid content type: ${contentType}`));
            }
        })
        .catch((error) => {
            if (onFail) {
                onFail(error);
            }
            showError(error.message);
        });
}
