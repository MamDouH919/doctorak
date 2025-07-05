import { FieldValues } from "react-hook-form";
import AutoCompleteComponent, { IProps as AutoCompleteComponentIProps } from "../MUI/AutoCompleteComponent";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "@/lib/api/dropdown";
import { useTranslation } from "react-i18next";

const ListCities = <T extends FieldValues>({
  name,
  label,
  control,
  skip = false,
  rules,
  disabled,
  governorateId
}: Omit<AutoCompleteComponentIProps<T>, "options" | "loading" | "valueKey"> & {
  skip?: boolean;
  disabled?: boolean;
  rules?: any;
  governorateId?: string;
}) => {
  const { i18n } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["cities", governorateId],
    queryFn: () => getCities(governorateId!),
    enabled: !skip && !!governorateId,
  });

  return (
    <AutoCompleteComponent
      control={control}
      rules={rules}
      label={label}
      name={name}
      disabled={disabled}
      options={
        (data?.data.cities.map((item) => ({
          id: item._id,
          name: item.name[i18n.language as "ar" | "en"],
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
      loading={isLoading}
      valueKey="id"
      fullWidth
    />
  );
};

export default ListCities;
