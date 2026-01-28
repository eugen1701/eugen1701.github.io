// Simple Node script to update age and days-until-next-birthday placeholders in index.html
// Adjust your birth date below.

const fs = require('fs');
const path = require('path');

// TODO: Set your real birth date here (YYYY-MM-DD)
const BIRTHDATE_ISO = '2001-01-17';

function getAgeAndDaysToBirthday(birthIso) {
  const birthDate = new Date(birthIso + 'T00:00:00Z');
  const today = new Date();

  // Use UTC dates to avoid timezone issues
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const birthUtc = new Date(Date.UTC(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()));

  let age = todayUtc.getUTCFullYear() - birthUtc.getUTCFullYear();

  const thisYearBirthday = new Date(Date.UTC(todayUtc.getUTCFullYear(), birthUtc.getUTCMonth(), birthUtc.getUTCDate()));
  if (todayUtc < thisYearBirthday) {
    age -= 1;
  }

  let nextBirthdayYear = todayUtc.getUTCFullYear();
  if (todayUtc >= thisYearBirthday) {
    nextBirthdayYear += 1;
  }

  const nextBirthday = new Date(Date.UTC(nextBirthdayYear, birthUtc.getUTCMonth(), birthUtc.getUTCDate()));
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysToBirthday = Math.round((nextBirthday - todayUtc) / msPerDay);

  return { ageYears: age, daysToBirthday };
}

function run() {
  const { ageYears, daysToBirthday } = getAgeAndDaysToBirthday(BIRTHDATE_ISO);

  const indexPath = path.join(__dirname, '..', 'index.html');
  const content = fs.readFileSync(indexPath, 'utf8');

  // Replace placeholders {{AGE_YEARS}} and {{DAYS_TO_BIRTHDAY}}
  let newContent = content.replace(/\{\{AGE_YEARS\}\}/g, String(ageYears));
  newContent = newContent.replace(/\{\{DAYS_TO_BIRTHDAY\}\}/g, String(daysToBirthday));

  fs.writeFileSync(indexPath, newContent, 'utf8');
  console.log(`Updated age to ${ageYears} and days-to-birthday to ${daysToBirthday}`);
}

run();

