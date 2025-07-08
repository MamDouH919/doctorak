"use client"
import * as React from 'react';
import { CellLink } from '@/components/data-table/CellLink';
import TankStackTable from '@/components/data-table/TankStackTable';
import { PaginatorInfo } from '@/types';
import { fetchListAccounts } from '@/lib/api/accounts';
import { useQuery } from '@tanstack/react-query';
import useDashboard from '@/hooks/useDashboard';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import BooleanCell from '@/components/MUI/BooleanCell';

export default function ListUsers() {
    const context = useDashboard();
    const { t, i18n } = useTranslation();

    const { data, isFetching } = useQuery({
        queryKey: ['accounts'],
        queryFn: () => fetchListAccounts(),
    });


    React.useEffect(() => {
        context?.dispatch({
            type: "SET_BREADCRUMB_LINKS",
            payload: [
                { label: t("breadCrumb.accounts") },
            ],
        });
        return () => { context?.dispatch({ type: "RESET_STATE" }) }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const columns = [
        {
            accessorKey: "domain",
            header: t("adminPages.domain"),
            cell: ({ row }: { row: any }) => (
                <CellLink to={`/dashboard/accounts/${row?.original?._id}`}>
                    {row?.original?.domain}
                </CellLink>
            ),
        },
        {
            accessorKey: "user.name",
            header: t("adminPages.userName"),
            cell: ({ row }: { row: any }) => (
                <Typography>
                    {row?.original?.user?.name[i18n.language]}
                </Typography>
            ),
        },
        {
            accessorKey: "user.email",
            header: t("adminPages.email"),
        },
        // {
        //     accessorKey: "role",
        //     header: "الدور",
        //     cell: ({ row }: { row: any }) => (
        //         <CellLink to={`/admin/roles/${row?.original?.role?.id}`}>
        //             {row?.original?.role?.name}
        //         </CellLink>
        //     ),
        // },
        {
            accessorKey: "active",
            header: t("adminPages.active"),
            cell: ({ row }: { row: any }) => (
                <BooleanCell value={row?.original?.active} />
            ),
        },
    ];

    return (
        <TankStackTable
            columns={columns}
            data={data?.data ?? [] as any}
            paginatorInfo={data?.pagination as PaginatorInfo}
            loading={isFetching}
        />
    );
}