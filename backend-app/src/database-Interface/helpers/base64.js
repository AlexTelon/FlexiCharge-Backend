exports.decodeBase64 = (base64String) => {
  return new Buffer.from(base64String, "base64url").toString("utf-8");
};

exports.encodeBase64 = (string) => {
  return new Buffer.from(string, "utf-8").toString("base64url");
};
