import { Platform } from 'react-native';
import { getErrorFromJson, showError } from './Errors';
import PlatformEnum from '../enums/PlatformEnum';

export function requestAlpinebook(url, onOk, onFail, resultModifier) {
    const baseUrl = 'https://04c85f4e.ngrok.io/';
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
