export const getIconByContentType = (contentType) => {
    switch (contentType) {
        case 'application/pdf':
            return 'file-pdf-o';
        case 'image/jpeg':
            return 'picture-o';
        default:
            return 'file-o';
    }
};
