let dataReceived: any;

export default async function restore(dataToRestore: any) {
  dataReceived = dataToRestore;
}

export function getFakeRawDbData() {
  return dataReceived;
}