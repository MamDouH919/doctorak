"use client"
import * as React from 'react';
import TankStackTable from '@/components/data-table/TankStackTable';
import { fetchListUsers, toggleUser } from '@/lib/api/users';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BooleanCell from '@/components/MUI/BooleanCell';
import { Button, Stack, Typography } from '@mui/material';
import CustomDialog from '@/components/MUI/CustomDialog';
import axios from 'axios';
import { toast } from 'sonner';

export default function ListUsers() {
    const { data, isLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: () => fetchListUsers(),
    });

    // mutation for activating user account react-query
    const [userId, setUserId] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const { mutate: toggleUserMutation, isPending: toggleUserLoading } = useMutation({
        mutationFn: (data: { id: string }) =>
            toggleUser(data),
        onError(error) {
            console.log(error);
        }
    });
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const queryClient = useQueryClient(); // Use this to access queryClient

    const handleActiveUser = async () => {
        setLoading(true);
        toggleUserMutation({
            id: userId!
        }, {
            onSuccess: async () => {
                setLoading(false);
                handleClose();
                toast.success("تم الحفظ بنجاح");
                queryClient.invalidateQueries({
                    queryKey: ['accounts'],
                });
            },
            onError: async (error) => {
                setLoading(false);
                toast.error("حدث خطأ أثناء تفعيل الحساب، يرجى المحاولة مرة أخرى.");
                console.log(error)
            }
        })
    };


    const columns = [
        {
            accessorKey: "name",
            header: "اسم المستخدم",
            // cell: ({ row }: { row: any }) => (
            //     <CellLink to={`/dashboard/accounts/${row?.original?._id}`}>
            //         {row?.original?.name}
            //     </CellLink>
            // ),
        },
        {
            accessorKey: "email",
            header: "البريد الإلكتروني",
        },
        {
            accessorKey: "image",
            header: "الصورة",
            cell: ({ row }: { row: any }) => (
                <a href={row?.original?.image} target="_blank" rel="noreferrer">
                    <img
                        src={row?.original?.image ?? "/images/avatar.png"}
                        alt={row?.original?.name}
                        style={{ width: 50, height: 50, borderRadius: '50%' }}
                    />
                </a>
            ),
        },
        {
            accessorKey: "active",
            header: "مفعل",
            cell: ({ row }: { row: any }) => (
                <Button
                    onClick={() => {
                        handleOpen();
                        setUserId(row?.original?._id);
                    }}
                    variant="contained"
                    color={row?.original?.active ? "error" : "success"}
                >
                    {row?.original?.active ? "تعطيل" : "تفعيل"}
                </Button>
            ),
        }
    ];



    return (
        <>
            <CustomDialog
                open={open}
                handleClose={handleClose}
                title={
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                        <Typography variant='body1'>{"تفعيل الحساب"}</Typography>
                    </Stack>
                }
                content={
                    <Stack spacing={1} mt={2}>
                        <Typography variant='body1'>{"هل تريد تفعيل الحساب ؟"}</Typography>
                    </Stack>
                }
                buttonAction={
                    <Button
                        loading={loading}
                        onClick={handleActiveUser}
                        variant='contained'

                    >
                        {"تأكيد"}
                    </Button>
                }
            />
            <TankStackTable
                columns={columns}
                data={data?.data ?? [] as any}
                // paginatorInfo={paginatorInfo as PaginatorInfo}
                loading={isLoading}
            />
        </>
    );
}

// ProductsList.layout = (page: any) => <DashboardLayout children={page} />;