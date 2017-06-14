export interface IList{
  getTitle(): string;
  getButtonText(): string;
  getButtonRouteText(): string;
  getServiceRouteText(index: number): string;
}
