"use client"
import * as React from 'react';
import { CellLink } from '@/components/data-table/CellLink';
import TankStackTable from '@/components/data-table/TankStackTable';
import { PaginatorInfo } from '@/types';
import { fetchListAccounts } from '@/lib/api/accounts';
import { useQuery } from '@tanstack/react-query';

export default function ListUsers() {
    const { data, isLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: () => fetchListAccounts(),
    });

    const columns = [
        {
            accessorKey: "domain",
            header: "النطاق",
            cell: ({ row }: { row: any }) => (
                <CellLink to={`/dashboard/accounts/${row?.original?._id}`}>
                    {row?.original?.domain}
                </CellLink>
            ),
        },
        {
            accessorKey: "user.name",
            header: "اسم المستخدم",
        },
        {
            accessorKey: "user.email",
            header: "البريد الإلكتروني",
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
        // {
        //     header: "المستخدم مفعل",
        //     cell: ({ row }: { row: any }) => (
        //         <BooleanCell value={row?.original?.user.active} />
        //     ),
        // },
    ];

    return (
        <TankStackTable
            columns={columns}
            data={data?.data ?? [] as any}
            paginatorInfo={data?.pagination as PaginatorInfo}
            loading={isLoading}
        />
    );
}