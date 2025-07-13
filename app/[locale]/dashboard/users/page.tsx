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
import useDashboard from '@/hooks/useDashboard';
import { useTranslation } from 'react-i18next';

export default function ListUsers() {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['accounts'],
        queryFn: () => fetchListUsers(),
    });

    const { t, i18n } = useTranslation()
    const context = useDashboard()

    // mutation for activating user account react-query
    const [userId, setUserId] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);
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

    React.useEffect(() => {
        context?.dispatch({
            type: "SET_BREADCRUMB_LINKS",
            payload: [
                { label: t("breadCrumb.users") },
            ],
        });
        return () => { context?.dispatch({ type: "RESET_STATE" }) }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t])

    const queryClient = useQueryClient(); // Use this to access queryClient

    const handleActiveUser = async () => {
        toggleUserMutation({
            id: userId!
        }, {
            onSuccess: async () => {
                handleClose();
                toast.success(t("common.saveSuccess"));
                queryClient.invalidateQueries({
                    queryKey: ['accounts'],
                });
            },
            onError: async (error) => {
                toast.error(t("common.errorMessage"));
                console.log(error)
            }
        })
    };


    const columns = [
        {
            accessorKey: "name",
            header: t("adminPages.userName"),
            cell: ({ row }: { row: any }) => (
                <Typography>
                    {row?.original?.name?.[i18n.language as "ar" | "en"]}
                </Typography>
            ),
        },
        {
            accessorKey: "email",
            header: t("adminPages.email"),
        },
        {
            accessorKey: "image",
            header: t("adminPages.image"),
            cell: ({ row }: { row: any }) => (
                <a href={row?.original?.image} target="_blank" rel="noreferrer">
                    <img
                        src={row?.original?.image ?? "/images/avatar.png"}
                        alt={row?.original?.name?.en}
                        style={{ width: 50, height: 50, borderRadius: '50%' }}
                    />
                </a>
            ),
        },
        {
            accessorKey: "verified",
            header: t("adminPages.verified"),
            cell: ({ row }: { row: any }) => (
                <BooleanCell value={row?.original?.verified} />
            ),
        },
        {
            accessorKey: "active",
            header: t("adminPages.active"),
            cell: ({ row }: { row: any }) => (
                <Button
                    onClick={() => {
                        handleOpen();
                        setUserId(row?.original?._id);
                    }}
                    variant="contained"
                    color={row?.original?.active ? "error" : "success"}
                >
                    {row?.original?.active ? t("adminPages.deactivate") : t("adminPages.activate")}
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
                        <Typography variant='body1'>{t("adminPages.enableUser")}</Typography>
                    </Stack>
                }
                content={
                    <Stack>
                        <Typography variant='body1'>{t("adminPages.confirmMessage")}</Typography>
                    </Stack>
                }
                buttonAction={
                    <Button
                        loading={toggleUserLoading}
                        onClick={handleActiveUser}
                        variant='contained'

                    >
                        {t("common.submit")}
                    </Button>
                }
            />
            <TankStackTable
                columns={columns}
                data={data?.data ?? [] as any}
                // paginatorInfo={paginatorInfo as PaginatorInfo}
                loading={isFetching}
            />
        </>
    );
}

// ProductsList.layout = (page: any) => <DashboardLayout children={page} />;