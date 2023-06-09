
export const pluralize = (num: number, word: string, plural = word + "s") =>
  [1, -1].includes(Number(num)) ? word : plural;


export const convertMinutesToClosestTimeValue = (minutesSinceCreation : number) => {
const yearInMinutes = 525948;
const monthInMinutes = 43829;
const dayInMinutes = 1410;
const hourInMinutes = 24;

if ( minutesSinceCreation > yearInMinutes) {
    const years = minutesSinceCreation / yearInMinutes
    return `${years.toFixed(0)} ${pluralize(years, "year")}`
}
else if ( minutesSinceCreation > monthInMinutes) {
    const month = minutesSinceCreation / monthInMinutes
    return `${month.toFixed(0)} ${pluralize(month, "year")}`
}
else if ( minutesSinceCreation > dayInMinutes) {
    const day = minutesSinceCreation / dayInMinutes
    return `${day.toFixed(0)} ${pluralize(day, "year")}`
}
else if ( minutesSinceCreation > hourInMinutes) {
    const hour = minutesSinceCreation / hourInMinutes
    return `${hour.toFixed(0)} ${pluralize(hour, "year")}`
}
}
