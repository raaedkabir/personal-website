// display formats for the FYP demo, in the visitor's locale (only used in the browser, where the data lives)

const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const time = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });

export const formatDateTime = (iso) => dateTime.format(new Date(iso));
export const formatTime = (iso) => time.format(new Date(iso));
export const formatTemperature = (celsius) => `${celsius.toFixed(1)} °C`;

export const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString();
