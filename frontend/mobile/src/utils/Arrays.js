export function modifyJsonInArray(arr, index, fn) {
    let rec = JSON.parse(arr[index]);
    fn(rec);
    arr[index] = JSON.stringify(rec);
}