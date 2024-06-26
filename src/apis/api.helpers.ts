// apis

let defaultApiAddress: string;

const hostname = window.location.hostname;
const protocol = window.location.protocol;
if (
  // hostname === 'celmeety.com' ||
  // hostname === 'www.celmeety.com' ||
  // hostname === 'dev.celmeety.com' ||
  // hostname === 'man.celmeety.com' ||
  // hostname === 'dev.man.celmeety.com' ||
  hostname === 'localhost' ||
  hostname === '127.0.0.1'
) {
  defaultApiAddress = protocol == 'https:' ? 'https://hdoapi.lhthuong.top' : 'http://hdoapi.lhthuong.top';
  // 'http://localhost:8080';
} else {
  defaultApiAddress = protocol == 'https:' ? 'https://hdoapi.lhthuong.top' : 'http://hdoapi.lhthuong.top';
}

export const defaultUrl = defaultApiAddress;

// export const refreshToken = async () => {
//   return await new Promise(async (resolve, reject) => {
//     if (auth.currentUser) {
//       auth.currentUser
//         .getIdToken(true)
//         .then(function (idToken) {
//           // setToken(idToken);
//           // window.localStorage.setItem("accessToken", JSON.stringify(idToken));
//           // console.log('localStorage 저장(api helper) - ', window.localStorage.getItem("accessToken"));
//           resolve(idToken);
//         })
//         .catch(function (error) {
//           reject('만료됨');
//         });
//     }
//   });
// };
