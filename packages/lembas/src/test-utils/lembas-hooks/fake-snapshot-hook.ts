/* eslint-disable @typescript-eslint/no-explicit-any */
let rawDataToReturn: any;

export default async function snapshot() {
  return rawDataToReturn;
}

export function setFakeRawDbData(fakeData: any) {
  rawDataToReturn = fakeData;
}
