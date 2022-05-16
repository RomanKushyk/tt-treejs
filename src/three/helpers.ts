export const onProgress = (xhr: any) => {
    console.log((xhr.loaded / xhr.total) + '% loaded');
}

export const onError = (xhr: any) => {
    console.log('And error happened');
}
