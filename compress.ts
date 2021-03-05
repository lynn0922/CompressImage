interface Options {
    maxLength: number;
    maxNotCompressSize: number;
    quality: number;
    file: any;
    success: any;
    error: any;
}

class CompressH5 implements Options {
    maxLength: number = 800;
    maxNotCompressSize: number = 200;
    quality: number = 0.8;
    file: any;
    success: any;
    error: any;

    img: HTMLImageElement = document.createElement('img');
    canvas: HTMLCanvasElement = document.createElement('canvas');
    ctx: CanvasRenderingContext2D;

    constructor(options: Options) {
        this.maxLength = options.maxLength;
        this.maxNotCompressSize = options.maxNotCompressSize;
        this.quality = options.quality;
        this.file = options.file;
        this.success = options.success;
        this.error = options.error;

        this.img.setAttribute('crossOrigin', 'Anonymous');
        this.ctx = this.canvas.getContext('2d');
    }

    compressImage() {
        if (this.file == null || this.success == null) return;

        let fileReader: FileReader = new FileReader();
        fileReader.onload = event => {
            if (this.file.size / 1024 <= this.maxNotCompressSize) {
                this.success(event.target.result);
                return;
            }
            (this.img.src as String | ArrayBuffer) = event.target.result;
        };
        fileReader.readAsDataURL(this.file);

        this.img.onload = () => {
            let nowWidth: number = 0;
            let nowHeight: number = 0;
            let realWidth: number = 0;
            let realHeight: number = 0;

            realWidth = this.img.naturalWidth;
            realHeight = this.img.naturalHeight;

            if (realWidth === 0 || realHeight === 0) {
                if (this.error) {
                    this.error('图片加载失败');
                }
                return;
            }

            if (realHeight > this.maxLength && realHeight >= realWidth) {
                nowHeight = this.maxLength;
                nowWidth = parseInt((((nowHeight / realHeight) * realWidth) as unknown) as string);
            } else if (realWidth > this.maxLength && realWidth >= realHeight) {
                nowWidth = this.maxLength;
                nowHeight = parseInt((((nowWidth / realWidth) * realHeight) as unknown) as string);
            } else {
                nowWidth = realWidth;
                nowHeight = realHeight;
            }

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.width = nowWidth;
            this.canvas.height = nowHeight;
            this.ctx.drawImage(this.img, 0, 0, nowWidth, nowHeight);
            this.success(this.canvas.toDataURL('image/jpeg', this.quality)); // 取值范围为 0 到 1
        };
    }

    dataURLtoBlob(dataURL: string) {
        let arr = dataURL.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let decodedData = atob(arr[1]);
        let length = decodedData.length;
        let u8arr = new Uint8Array(length);
        while (length--) {
            u8arr[length] = decodedData.charCodeAt(length);
        }
        return new Blob([u8arr], { type: mime });
    }

    blobTofile(blob: Blob, file: any) {
        // 将blob 转成 file 对象进行上传
        return new window.File([blob], file.name, { type: file.type });
    }

    checkFileType(file: any) {
        if (file == null) {
            return false;
        }

        return /\.(JPEG|jpeg|JPG|jpg|GIF|gif|PNG|png)$/i.test(file.name);
    }
}
