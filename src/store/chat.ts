class ChatFile {
    loading: boolean = true;
    name: string = '';
    size: number = 0;
    type: string = '';
    extension: string = '';
    localUrl: string = '';


    constructor(loading: boolean, name: string, size: number, type: string, extension: string, localUrl: string) {
        this.loading = loading;
        this.name = name;
        this.size = size;
        this.type = type;
        this.extension = extension;
        this.localUrl = localUrl;
    }
}

class ChatMessage {
    text: string = '';
    time: Date = new Date();
    senderName: string = '';
    senderId: string = '';
    senderType: string = '';
    images: any[] = [];

    constructor(text: string, time: Date, senderName: string, senderId: string, senderType: string, images: any[]) {
        this.text = text;
        this.time = time;
        this.senderName = senderName;
        this.senderId = senderId;
        this.senderType = senderType;
        this.images = images;
    }

    dateToString(): string {
        let year = this.time.getFullYear();
        let month = this.time.getMonth() + 1;
        let day = this.time.getDate();
        let hour = this.time.getHours();
        let minute = this.time.getMinutes();
        let second = this.time.getSeconds();
        let hourString = hour < 10 ? '0' + hour : hour;
        let minuteString = minute < 10 ? '0' + minute : minute;
        let secondString = second < 10 ? '0' + second : second;
        return year + '/' + month + '/' + day + ' ' + hourString + ':' + minuteString + ':' + secondString;
    }
}

export {ChatFile, ChatMessage}
