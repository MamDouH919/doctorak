import { FieldValues } from "react-hook-form";
import AutoCompleteComponent, { IProps as AutoCompleteComponentIProps } from "../MUI/AutoCompleteComponent";

const data = [
  {
    _id: "1",
    slug: "sunday",
    name: {
      ar: "الأحد",
      en: "Sunday",
    },
  },
  {
    _id: "2",
    slug: "monday",
    name: {
      ar: "الإثنين",
      en: "Monday",
    },
  },
  {
    _id: "3",
    slug: "tuesday",
    name: {
      ar: "الثلاثاء",
      en: "Tuesday",
    },
  },
  {
    _id: "4",
    slug: "wednesday",
    name: {
      ar: "الأربعاء",
      en: "Wednesday",
    },
  },
  {
    _id: "5",
    slug: "thursday",
    name: {
      ar: "الخميس",
      en: "Thursday",
    },
  },
  {
    _id: "6",
    slug: "friday",
    name: {
      ar: "الجمعة",
      en: "Friday",
    },
  },
  {
    _id: "7",
    slug: "saturday",
    name: {
      ar: "السبت",
      en: "Saturday",
    },
  }
];

const ListDays = <T extends FieldValues>({
  name,
  label,
  control,
  skip = false,
  rules,
  disabled
}: Omit<AutoCompleteComponentIProps<T>, "options" | "loading" | "valueKey"> & {
  skip?: boolean;
  disabled?: boolean;
  rules?: any;
}) => {

  return (
    <AutoCompleteComponent
      control={control}
      rules={rules}
      label={label}
      name={name}
      disabled={disabled}
      options={
        (data.map((item) => ({
          id: item.slug,
          name: item.name.ar,
        })) ?? []) as any
      }
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <span>{option?.name}</span>
          {/* <ColorSpan>{option?.code}</ColorSpan> */}
        </li>
      )}
      getOptionLabel={(option) => option?.name ?? ""}
      getOptionKey={(option) => option.id}
      loading={false}
      valueKey="id"
      fullWidth
    />
  );
};

export default ListDays;
