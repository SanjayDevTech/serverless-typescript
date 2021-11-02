import { _400, _500, middyfy, _200, success } from "@libs/apiGateway";

export const main = middyfy(async (event) => {
  try {
    // if (!event.claim.isValid) {
    //   return _400("UnAuthorised");
    // }
    return _200(success([]));
  } catch (e) {
    console.log(e);
    return _500();
  }
});
