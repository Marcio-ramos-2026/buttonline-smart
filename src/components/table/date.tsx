'use client'
import {DateTimeFormatOptions, useFormatter, useNow} from 'next-intl';

export const DateRelativeFormatter = ({date}:{date?:Date}) => {
    const formatter = useFormatter()
    const now = useNow({
        // … and update it every 10 seconds
        updateInterval: 1000 * 10
      });
    if(!date) return null
    return formatter.relativeTime(date as Date,{now})
}

export const DateFormatter = ({date,options}:{date?:Date,options?:DateTimeFormatOptions}) => {
    const formatter = useFormatter()
    return formatter.dateTime(date as Date,options)
}