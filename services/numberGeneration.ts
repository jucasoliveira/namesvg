import { sha512 } from "js-sha512";

let seed: any;
let digitIndex: any;

export const setSeed = (s: any) => {
  seed = sha512(s);
  digitIndex = 0;
};

export const setRandomSeed = () => {
  seed = sha512(Math.random().toString());
  digitIndex = 0;
};

// Returns an integer between 0 and bound
export const getInteger = (bound: number) => {
  const nbDigits = 2;
  if (digitIndex + nbDigits > seed.length) digitIndex = 0;
  /* 
  console.log(seed.substr(digitIndex, nbDigits));
  console.log(`0x${seed.substr(digitIndex, nbDigits)}`, 16);
  console.log(`0x${seed.substr(digitIndex, nbDigits)}`, 16 % (bound + 1));
  console.log(parseInt(`0x${seed.substr(digitIndex, nbDigits)}`, 16));
  */

  // All variables are 32-bit unsigned integers and addition is calculated on module 2^32
  // parseInt radix 16 is hexadecimal
  const result =
    parseInt(`0x${seed.substr(digitIndex, nbDigits)}`, 16) % (bound + 1);
  digitIndex += nbDigits;
  return result;
};

// Returns an integer between min and max
export const getIntegerInRange = (min: number, max: number) => {
  const val = getInteger(max - min) || 0;
  return min + val;
};

// Returns a float between min and max (nbSteps possible values)
export const getFloatInRange = (min: number, max: number, nbSteps = 16) =>
  min + (getInteger(nbSteps) / nbSteps) * (max - min);

export const getSeed = () => seed;
