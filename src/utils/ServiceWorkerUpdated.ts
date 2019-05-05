
let resolvePromise = () => { };
const updateExistsPromise = new Promise((resolve, reject) => {
  resolvePromise = resolve;
})

export const registerUpdate = resolvePromise;
export default updateExistsPromise;