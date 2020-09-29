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

  public static Decimal getValueOfOneBitcoinInUSD(){ 
    Http http = new Http();
    HttpRequest request = new HttpRequest();
    request.setEndpoint('https://bitpay.com/api/rates/');
    request.setMethod('GET');
    HttpResponse response = http.send(request);
    if(response.getStatusCode() == 200) {
        List<Object> results = (List<Object>) JSON.deserializeUntyped(response.getBody());
        for(Object ob: results) {
            Map<String, Object> mapJson = (Map<String,Object>) ob;
            if(mapJson.get('code') == 'USD') {
                return (Decimal) mapJson.get('rate');
            }
        }
    }
    return null;
} 
}
