import { pluralize } from "@app/shared/helper-functions/helper-functions";
import { Notice } from "@app/shared/models/notice/notice.model";


export class NoticesService {
    
    static convertMinutesToClosestTimeValue = (date: Date) => {
        const minutesSinceCreation = this.minutesBetweenTodayAndDate(date);
        const minutesInAYear = 525600;
        const minutesInAMonth = 43200;
        const minutesInADay = 1440;
        const minutesInAnHour = 60;
    
        if ( minutesSinceCreation > minutesInAYear) {
            const years = minutesSinceCreation / minutesInAYear
            return `${years.toFixed(0)} ${pluralize(years, "year")} ago`
        }
        else if ( minutesSinceCreation > minutesInAMonth) {
            const month = minutesSinceCreation / minutesInAMonth
            return `${month.toFixed(0)} ${pluralize(month, "month")} ago`
        }
        else if ( minutesSinceCreation > minutesInADay) {
            const day = minutesSinceCreation / minutesInADay
            return `${day.toFixed(0)} ${pluralize(day, "day")} ago`
        }
        else if ( minutesSinceCreation > minutesInAnHour) {
            const hour = minutesSinceCreation / minutesInAnHour
            return `${hour.toFixed(0)} ${pluralize(hour, "hour")} ago`
        }
        else if ( minutesSinceCreation > 1 ) {
            return `${minutesSinceCreation.toFixed(0)} ${pluralize(minutesSinceCreation, "minute")} ago`
        }
        else if ( minutesSinceCreation < 1 ) {
            return "now";
        }
        return 'system error';
    }
    
    static convertDateToMinutes = (date : Date) => new Date(date).getTime() / 1000 / 60;
    
    static minutesBetweenTodayAndDate = (creationDate : Date) => {
        const local = new Date();
        const offset = local.getTimezoneOffset();
        const utcToday = new Date(local.getTime() + offset * 60000);
        return this.convertDateToMinutes(new Date(utcToday)) - this.convertDateToMinutes(creationDate);
    }
}

