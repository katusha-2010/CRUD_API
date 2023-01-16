import { ERR_INVALID_DATA, ERR_INVALID_FIELDS } from "../app/constant_error";
import { InvalidError } from "../app/errors";
import { UsersType } from "./users";

export function validateUsers(requestData:UsersType){
  if(typeof requestData.username !== 'string' || 
  typeof requestData.age !== 'number' || 
  !Array.isArray(requestData.hobbies)) {
    throw new InvalidError(ERR_INVALID_DATA);
  }
  
  if(requestData.hobbies.every(el => typeof el !== 'string') && requestData.hobbies.length > 0) {
    throw new InvalidError(ERR_INVALID_DATA);
  }
}
