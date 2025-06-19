export function generateIds(fullName: string, date = new Date()) {
  const initials = fullName
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2); // Max 2 initials

  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random

  return `${initials}${year}${month}${randomNumber}`;
}
