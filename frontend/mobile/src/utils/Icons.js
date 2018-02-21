export const getIconByExt = (ext) => {
    switch (ext) {
        case 'pdf':
            return 'file-pdf-o';
        case 'jpg':
        case 'jpeg':
            return 'picture-o';
        default:
            return 'file-o';
    }
};
