class CognitoResponseHandler{
    reformatUserInformationResponse(cognitoResponse){
        const attributes = cognitoResponse.UserAttributes;
        var res = {
            username:"",
            firstName:"",
            lastName:"",
            phoneNumber:"",
            streetAddress:"",
            zipCode:"",
            city:"",
            country:""
        };
        for(let attribute of attributes){
            switch(attribute.Name){
                case('email'):
                    res.username = attribute.Value;
                    break;
                
                case('name'):
                    res.firstName = attribute.Value;
                    break;
                
                case('family_name'):
                    res.lastName = attribute.Value;
                    break;
                
                case('phone_number'):
                    res.phoneNumber = attribute.Value;
                    break;
                
                case('custom:city'):
                    res.city = attribute.Value;
                    break;
                
                case('custom:street_address'):
                    res.streetAddress = attribute.Value;
                    break;

                case('custom:zip_code'):
                    res.zipCode = attribute.Value;
                    break;
                    
                case('custom:country'):
                    res.country = attribute.Value;
                    break;
            }
        }   
        return res;
    }
}
module.exports = CognitoResponseHandler;