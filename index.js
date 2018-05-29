const request = require("axios"); // eslint-disable-line

const apiId = 21;
const limit = 1000;
const STAGE_API = "https://stage-env-api-stage-ext.imrapid.io/v2/api/";

const getApiVersionId = async () => {
  const apiUrl = `${STAGE_API}${apiId}?include=version`;
  try {
    const {
      data: {
        data: {
          version: {
            id
          }
        }
      }
    } = await request(apiUrl);
    return id;
  } catch (e) {
    console.log(e);
    return false;
  }
};


const getEndpointsId = async (apiVersion) => {
  const endpointsUrl = `${STAGE_API}${apiId}/version/${apiVersion}/endpoints?limit=${limit}`;
  try {
    const {
      data: {
        data
      }
    } = await request(endpointsUrl);
    return data.map(endpointsId => endpointsId.id);
  } catch (e) {
    console.log(e);
    return false;
  }
};


const getParameters = (apiVersion, endpointId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const parametersUrl = `${STAGE_API}${apiId}/version/${apiVersion}/endpoint/${endpointId}/parameters?limit=${limit}`;
      const {
        data
      } = await request(parametersUrl);
      // console.log(endpointId);
      return resolve(data);
    } catch (e) {
      reject(e);
    }
    return true;
  });
};

const run = async () => {
  const apiVersion = await getApiVersionId();
  const endpointsId = await getEndpointsId(apiVersion);
  // console.log("start--------->", endpointsId);
  const promiseArr = endpointsId.map(item => getParameters(apiVersion, item));
  const result = [];
  await Promise.all(promiseArr).then((values) => {
    // console.log(values);
    values.forEach((item) => {
      // console.log(item);
      result.push(item.data);
    });
  });

  const SortByDate = result.map(arr => arr.sort((a, b) => a.createdAt - b.createdAt));
  // var unique = result.filter(function (set) {
  //   return function (f) {
  //     return !set.has(f.name) && set.add(f.name);
  //   };
  // }(new Set()));
  // similar to in down

  const getUnique = SortByDate.map(arr => arr.filter((set => f => !set.has(f.name) && set.add(f.name))(new Set())));

  console.log(getUnique[0]);
};

run();
