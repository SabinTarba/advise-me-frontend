import TimeAgo from 'javascript-time-ago';

// English.
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);
// Create formatter (English).
const timeAgoConverter = new TimeAgo('en-US')

export function timeAgo(date: string){
    return timeAgoConverter.format(new Date(date), 'round')
}