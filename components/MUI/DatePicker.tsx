
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface DatePickerValueProps {
    value: Dayjs | null;
    setValue: (newValue: Dayjs | null) => void;
    label: string
}

export default function DatePickerValue({ value, setValue, label }: DatePickerValueProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker
                    label={label}
                    value={value} // Use the value prop
                    onChange={(newValue) => setValue(newValue ? dayjs(newValue) : null)} // Convert newValue to Dayjs
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}
