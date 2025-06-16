import { FieldValues } from "react-hook-form";
import AutoCompleteComponent, { IProps as AutoCompleteComponentIProps } from "../MUI/AutoCompleteComponent";
import { listServicesDropDown } from "@/lib/api/accounts";
import { useQuery } from "@tanstack/react-query";

const ListAccounts = <T extends FieldValues>({
  name,
  label,
  control,
  skip = false,
  disabled
}: Omit<AutoCompleteComponentIProps<T>, "options" | "loading" | "valueKey"> & {
  skip?: boolean;
  disabled?: boolean;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["listServicesDropDown"],
    queryFn: () => listServicesDropDown(),
    enabled: !skip,
  });

  return (
    <AutoCompleteComponent
      control={control}
      label={label}
      name={name}
      disabled={disabled}
      options={
        (data?.data.map((item: any) => ({
          id: item._id,
          name: item.user?.name,
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
    />
  );
};

export default ListAccounts;
