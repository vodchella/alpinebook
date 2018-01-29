import { getErrorFromJson, showError } from './Errors';

export function requestAlpinebook(url, onOk, onFail, resultModifier) {
    const baseUrl = 'https://1da69b9f-cf2f-4bb4-8785-ed8fb1dde142.mock.pstmn.io/';
    const apiUrl = `${baseUrl}api/v1/`;
    const requestUrl = `${apiUrl}${url}`;

    fetch(requestUrl)
        .then((response) => {
            const contentType = response.headers.get('Content-Type') || '';
            const isJson = contentType.includes('application/json');
            let invalidContentType = false;

            if (response.ok) {
                if (isJson) {
                    response.json().then((responseJson) => {
                        if (resultModifier) {
                            responseJson = resultModifier(responseJson);
                        }
                        onOk(responseJson);
                    });
                } else {
                    invalidContentType = true;
                }
            } else {
                if (isJson) {
                    response.json().then((responseJson) => {
                        onFail(responseJson);
                        showError(getErrorFromJson(responseJson));
                    });
                } else {
                    invalidContentType = true;
                }
            }

            if (invalidContentType) {
                return Promise.reject(new Error('Invalid content type: ' + contentType));
            }

        })
        .catch((error) => {
            onFail(error);
            showError(error.message);
        });
}