export function modifyJsonInArray(arr, index, fn) {
    let rec = JSON.parse(arr[index]);
    fn(rec);
    arr[index] = JSON.stringify(rec);
}

export function jsonArrayToListData(arr, idField, nameField) {
    let result = [];
    arr.map((elem) => {
        let item = {};
        item.id = elem[idField];
        item.name = elem[nameField];
        result.push(item);
    });
    return result;
}