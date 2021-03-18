/**
 *  Download a file at the given URL
 *
 * @param {string} url : The URL of the file to download
 *
 */
export const downloadFile = async (url) => {
  let a = null;

  try {
    const response = await fetch(url);
    const filename = response.headers
      .get("Content-Disposition")
      .split("filename=")[1]
      .replace(/"/g, "");

    const blob = await response.blob();
    a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.target = "_blank";
    a.download = filename;
    // some browsers require element on DOM
    document.body.appendChild(a);

    a.click();
  } catch (err) {
    console.error(err);
  } finally {
    if (a) {
      a.remove();
      window.URL.revokeObjectURL(a.href);
    }
  }
};
