class CognitoResponseHandler{
    reformatUserInformationResponse(cognitoResponse){
        const attributes = cognitoResponse.UserAttributes;
        var userInformation = {
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
                    userInformation.username = attribute.Value;
                    break;
                
                case('name'):
                    userInformation.firstName = attribute.Value;
                    break;
                
                case('family_name'):
                    userInformation.lastName = attribute.Value;
                    break;
                
                case('phone_number'):
                    userInformation.phoneNumber = attribute.Value;
                    break;
                
                case('custom:city'):
                    userInformation.city = attribute.Value;
                    break;
                
                case('custom:street_address'):
                    userInformation.streetAddress = attribute.Value;
                    break;

                case('custom:zip_code'):
                    userInformation.zipCode = attribute.Value;
                    break;
                    
                case('custom:country'):
                    userInformation.country = attribute.Value;
                    break;
            }
        }   
        return userInformation;
    }
    reformatUserInformationResponseWithUserId(cognitoResponse){
        var userInformation = this.reformatUserInformationResponse(cognitoResponse);
        userInformation.userId = cognitoResponse.Username;
        return userInformation;
    }
}
module.exports = CognitoResponseHandler;