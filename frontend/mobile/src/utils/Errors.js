import { Toast } from 'native-base';

export function showError(msg) {
    Toast.show({text: msg, type: 'danger', duration: 3000});
}

export function getErrorFromJson(jsonObject) {
    if (jsonObject.error) {
        let error = jsonObject.error;
        let code = error.code ? `[${error.code}] ` : '';
        let message = error.message || JSON.stringify(error);
        return `${code}${message}`
    } else {
        return 'Неизвестная ошибка';
    }
}