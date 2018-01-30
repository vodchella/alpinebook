import { Toast } from 'native-base';

export function showError(msg) {
    Toast.show({ text: msg, type: 'danger', duration: 3000 });
}

export function getErrorFromJson(jsonObject) {
    if (jsonObject.error) {
        const error = jsonObject.error;
        const code = error.code ? `[${error.code}] ` : '';
        const message = error.message || JSON.stringify(error);
        return `${code}${message}`;
    }
    return 'Неизвестная ошибка';
}
