"use client"
import * as React from 'react';
import { CellLink } from '@/components/data-table/CellLink';
import TankStackTable from '@/components/data-table/TankStackTable';
import { PaginatorInfo } from '@/types';
import { fetchListAccounts } from '@/lib/api/accounts';
import { useQuery } from '@tanstack/react-query';
import { fetchListFaqs } from '@/lib/api/faqs';
import useDashboard from '@/hooks/useDashboard';
import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import FormDialog from './_formDialog';

export default function ListFaqs() {
  const context = useDashboard()
  const [open, setOpen] = React.useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => fetchListFaqs(),
  });

  React.useEffect(() => {
    context?.dispatch({
      type: "UPDATE_STATE",
      payload: {
        pageActions:
          <Stack direction={"row"} spacing={1}>
            <Button variant="contained" color="primary" size="small" onClick={() => setOpen(true)}>
              <Add />
            </Button>
          </Stack>,
        breadcrumbLinks: [
          { label: "الأسئلة الشائعة" },
        ],
      },
    });
    return () => { context?.dispatch({ type: "RESET_STATE" }) }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      accessorKey: "question",
      header: "السؤال",
    },
    {
      accessorKey: "answer",
      header: "الجواب",
    },
  ];

  return (
    <>
      <FormDialog 
        open={open}
        handleClose={() => setOpen(false)}
      />
      <TankStackTable
        columns={columns}
        data={data?.data ?? [] as any}
        paginatorInfo={data?.pagination as PaginatorInfo}
        loading={isLoading}
      />
    </>
  );
}