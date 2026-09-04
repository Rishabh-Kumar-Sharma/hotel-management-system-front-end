import { CountryLocale, CountryRegion, TimeZones } from "../types";

export const getBusinessTimeZone = () => {
  return TimeZones.INDIA;
};

export const getCountryRegion = () => {
  return CountryRegion.UK;
};

export const getCountryLocale = (): CountryLocale | undefined => {
  switch (getCountryRegion()) {
    case CountryRegion.INDIA:
      return CountryLocale.INDIA;
    case CountryRegion.USA:
      return CountryLocale.USA;
    case CountryRegion.UK:
      return CountryLocale.UK;
    default:
      return;
  }
};
