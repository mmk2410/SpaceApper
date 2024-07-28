export { changeUserAgent };

function changeUserAgent(details) {
  for (const header of details.requestHeaders) {
    if (header.name.toLowerCase() === "user-agent") {
      header.value = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0";
      break;
    }
  }
  return { requestHeaders: details.requestHeaders };
}