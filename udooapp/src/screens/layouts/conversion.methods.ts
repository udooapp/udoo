export class ConversionMethods{
  public getAddress(location: string) {
    if (location == null || location === 'null' || location.length == 0) {
      return '';
    } else if (!location.match('address')) {
      return location;
    }
    return JSON.parse(location).address;
  }


  public getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '';
    }
    return url;
  }

  public isExpired(millis: number) {
    return millis == null || new Date() > new Date(millis);
  }

  public convertMillisToDate(millis: number): string {
    let date: Date = new Date(millis);
    return date.getFullYear() + '/' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '/' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }

}
