# h5 图片压缩

类提供如下方法：

    1.  compressImage 压缩
    2.  dataURLtoBlob 回调返回的是 base64 ， 你可能需要转换成 blob 进行上传
    3.  blobTofile 这个方法是讲 blob 转成 file 对象
    4.  checkFileType 校验图片后缀， 目前支持 JPEG|jpeg|JPG|jpg|GIF|gif|PNG|png 

参数说明：

    maxLength: 1080, // 最大长度或宽度
    maxNotCompressSize: 2048, // 不压缩指定大小以内的文件 单位 KB
    quality: 0.8, // 图片压缩质量 0-1之间 1最好
    file: null, // 必须，input中的文件
    success: null, // 必须，成功的回调
    error: null, // 失败的回调
