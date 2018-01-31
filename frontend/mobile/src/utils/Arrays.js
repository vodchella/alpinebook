export function modifyJsonInArray(arr, index, fn) {
    const rec = JSON.parse(arr[index]);
    /* eslint-disable no-param-reassign */
    arr[index] = JSON.stringify(fn(rec));
}

export function jsonArrayToListData(arr, idField, nameField) {
    const result = arr.map((elem) => {
        const item = elem;
        item.id = elem[idField];
        item.name = elem[nameField];
        return item;
    });
    return result;
}
