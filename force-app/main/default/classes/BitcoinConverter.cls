public without sharing class BitcoinConverter {
  @AuraEnabled
  public static String getBitcoinConverstionRates() {
    Http http = new Http();
    HttpRequest request = new HttpRequest();
    request.setMethod('GET');
    request.setEndpoint('https://bitpay.com/api/rates/');
    HttpResponse response = http.send(request);
    if (response.getStatusCode() == 200) {
      String listOfConversionRates = response.getBody();
      return listOfConversionRates;
    }
    return null;
  }
}
