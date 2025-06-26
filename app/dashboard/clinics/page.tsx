"use client"
import * as React from 'react';
import TankStackTable from '@/components/data-table/TankStackTable';
import { PaginatorInfo } from '@/types';
import { useQuery } from '@tanstack/react-query';
import useDashboard from '@/hooks/useDashboard';
import { Add, Delete, Edit } from '@mui/icons-material';
import { Button, IconButton, Stack } from '@mui/material';
import FormDialog from './_formDialog';
import { ColumnDef } from '@tanstack/react-table';
import DeleteDialog from './_deleteDialog';
import { useAppSelector } from '@/Store/store';
import { fetchListClinics } from '@/lib/api/clinics';

export default function ListClinics() {
  const context = useDashboard()
  const { auth } = useAppSelector((state) => state)
  const [createState, setCreateState] = React.useState<{ open: boolean, data: any }>({
    open: false,
    data: null
  })
  const [deleteState, setDeleteState] = React.useState({
    open: false,
    id: null
  })
  const { data, isLoading } = useQuery({
    queryKey: ['clinics'],
    queryFn: () => fetchListClinics(),
  });

  React.useEffect(() => {
    context?.dispatch({
      type: "UPDATE_STATE",
      payload: {
        pageActions:
          <Stack direction={"row"} spacing={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setCreateState({ open: true, data: null })}
            >
              <Add />
            </Button>
          </Stack>,
        breadcrumbLinks: [
          { label: "العيادات والمستشفيات" },
        ],
      },
    });
    return () => { context?.dispatch({ type: "RESET_STATE" }) }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: ColumnDef<any>[] = [
    ...(auth?.user?.role === 'admin' ? [
      {
        accessorKey: "account",
        header: "الحساب",
        cell: ({ row }: { row: any }) => {
          return (
            <Stack direction={"row"} spacing={0.5}>
              {row.original.account.user.name}
            </Stack>
          );
        }
      },
    ] : []),
    {
      accessorKey: "name",
      header: "الاسم",
    },
    {
      accessorKey: "governorate.name.ar",
      header: "المحافظة",
    },
    {
      accessorKey: "city.name.ar",
      header: "المدينة",
    },
    {
      accessorKey: "address",
      header: "العنوان",
    },
    {
      accessorKey: "phone",
      header: "الهاتف",
    },
    {
      accessorKey: "mobile",
      header: "الموبايل",
    },

    {
      header: "-",
      cell: ({ row }) => {
        return (
          <Stack direction={"row"} spacing={0.5}>
            <IconButton size='small'>
              <Edit
                color='info'
                fontSize='small'
                onClick={() => setCreateState({
                  open: true,
                  data: row.original
                })}
              />
            </IconButton>
            <IconButton size='small'>
              <Delete color='error' fontSize='small' onClick={() => setDeleteState({
                open: true,
                id: row.original._id
              })} />
            </IconButton>
          </Stack>
        );
      }
    }
  ];

  return (
    <>
      {createState.open &&
        <FormDialog
          open={createState.open}
          handleClose={() => setCreateState({ open: false, data: null })}
          oldData={createState.data}
        />
      }
      {deleteState.id && <DeleteDialog
        open={deleteState.open}
        handleClose={() => setDeleteState({ open: false, id: null })}
        id={deleteState.id}
      />}

      <TankStackTable
        columns={columns}
        data={data?.data ?? [] as any}
        paginatorInfo={data?.pagination as PaginatorInfo}
        loading={isLoading}
      />
    </>
  );
}