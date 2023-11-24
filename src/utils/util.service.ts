import { HttpException, HttpStatus } from '@nestjs/common';

export class UtilService {
  constructor() {}

  /**
   * This functions takes the user's mobile number and adds the country
   * code as it is required by the twilio api
   * @param mobileNumber : mobile number of user
   * @returns parsed mobile number
   */
  parseMobileNumber(mobileNumber: string) {
    // return the mobile number if it has up to 14 characters e.g. +2347181354770
    if (mobileNumber.length === 14) return mobileNumber;

    // strip the first number and add +234 if it has 11 characters e.g. 07181354770
    if (mobileNumber.length === 11) {
      let newMobileNumber = mobileNumber.slice(1);
      newMobileNumber = '+234' + newMobileNumber;
      return newMobileNumber;
    }
    throw new HttpException(
      'Mobile number could not be parsed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
