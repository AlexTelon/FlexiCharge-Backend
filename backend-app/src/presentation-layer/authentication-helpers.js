function getAccessTokenFromRequestHeader(request){
    return request.header('authorization').split(' ')[1];
}

module.exports = { getAccessTokenFromRequestHeader }