
function containsNonEnglish(str) {
  const nonEnglishRegex = /[^A-Za-z\s]/;
  return nonEnglishRegex.test(str);
}
// export const smsCountCheck = (num) => {
//   return Math.ceil(num / 160);
// };


export const smsCountCheck = (num , text) => {
  if (containsNonEnglish(text)) {
      return Math.ceil(num / 70);
  } else {
      return Math.ceil(num / 160);
  }
};
