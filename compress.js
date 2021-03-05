var CompressH5 = /** @class */ (function () {
    function CompressH5(options) {
        this.maxLength = 800;
        this.maxNotCompressSize = 200;
        this.quality = 0.8;
        this.img = document.createElement('img');
        this.canvas = document.createElement('canvas');
        this.maxLength = options.maxLength;
        this.maxNotCompressSize = options.maxNotCompressSize;
        this.quality = options.quality;
        this.file = options.file;
        this.success = options.success;
        this.error = options.error;
        this.img.setAttribute('crossOrigin', 'Anonymous');
        this.ctx = this.canvas.getContext('2d');
    }
    CompressH5.prototype.compressImage = function () {
        var _this = this;
        if (this.file == null || this.success == null)
            return;
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            if (_this.file.size / 1024 <= _this.maxNotCompressSize) {
                _this.success(event.target.result);
                return;
            }
            _this.img.src = event.target.result;
        };
        fileReader.readAsDataURL(this.file);
        this.img.onload = function () {
            var nowWidth = 0;
            var nowHeight = 0;
            var realWidth = 0;
            var realHeight = 0;
            realWidth = _this.img.naturalWidth;
            realHeight = _this.img.naturalHeight;
            if (realWidth === 0 || realHeight === 0) {
                if (_this.error) {
                    _this.error('图片加载失败');
                }
                return;
            }
            if (realHeight > _this.maxLength && realHeight >= realWidth) {
                nowHeight = _this.maxLength;
                nowWidth = parseInt(((nowHeight / realHeight) * realWidth));
            }
            else if (realWidth > _this.maxLength && realWidth >= realHeight) {
                nowWidth = _this.maxLength;
                nowHeight = parseInt(((nowWidth / realWidth) * realHeight));
            }
            else {
                nowWidth = realWidth;
                nowHeight = realHeight;
            }
            _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this.canvas.width = nowWidth;
            _this.canvas.height = nowHeight;
            _this.ctx.drawImage(_this.img, 0, 0, nowWidth, nowHeight);
            _this.success(_this.canvas.toDataURL('image/jpeg', _this.quality)); // 取值范围为 0 到 1
        };
    };
    CompressH5.prototype.dataURLtoBlob = function (dataURL) {
        var arr = dataURL.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var decodedData = atob(arr[1]);
        var length = decodedData.length;
        var u8arr = new Uint8Array(length);
        while (length--) {
            u8arr[length] = decodedData.charCodeAt(length);
        }
        return new Blob([u8arr], { type: mime });
    };
    CompressH5.prototype.blobTofile = function (blob, file) {
        // 将blob 转成 file 对象进行上传
        return new window.File([blob], file.name, { type: file.type });
    };
    CompressH5.prototype.checkFileType = function (file) {
        if (file == null) {
            return false;
        }
        return /\.(JPEG|jpeg|JPG|jpg|GIF|gif|PNG|png)$/i.test(file.name);
    };
    return CompressH5;
}());
