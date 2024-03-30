export function getDateAsId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero based.
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  // Combine all parts into a single string
  const timestampString = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

  // Convert the string to a number
  const timestampNumber = Number(timestampString);

  return timestampNumber;
}
