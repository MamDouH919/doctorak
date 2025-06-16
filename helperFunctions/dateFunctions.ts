import moment from "moment";

export const dateFormat = (date: string | null, lang?: string | null) => moment(date).locale(lang ?? "en").format("YYYY-MM-DD");

export const dateFormatLL = (date: string | null, lang?: string | null) =>
  date ? moment(date).locale(lang ?? "en").format("ll") : null;

export const dateFormatLLL = (date: string | null, lang?: string | null) =>
  date ? moment(date).locale(lang ?? "en").format("ll") : null;

export const dateTimeFormatA = (date: string | null, _lang?: string | null) =>
  date ? moment(date).format('D MMMM YYYY h:mm:ss') : null;

export const dateTimeFormat = (date: string | null, lang?: string | null) =>
  date
    ? moment(date)
      .locale(lang ?? "en")
      .format("YYYY-MM-DD HH:MM:SS")
    : null;
