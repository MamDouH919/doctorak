"use client"
import * as React from 'react';
import TankStackTable from '@/components/data-table/TankStackTable';
import { fetchListUsers } from '@/lib/api/users';
import { useQuery } from '@tanstack/react-query';

export default function ListUsers() {
    const { data, isLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: () => fetchListUsers(),
    });


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
            // paginatorInfo={paginatorInfo as PaginatorInfo}
            loading={isLoading}
        />
    );
}

// ProductsList.layout = (page: any) => <DashboardLayout children={page} />;