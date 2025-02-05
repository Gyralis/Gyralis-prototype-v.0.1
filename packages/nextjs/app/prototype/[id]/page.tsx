"use client"
import { useRouter } from 'next/navigation';
import { NextPage } from 'next';

const Page: NextPage = async ({ params }: { params: { id: string } }) => {
    
    const { id } = params;

    return (
        <div>
            <h1>Organization page: {id}</h1>
            <p>This is a dynamic page with the ID: {id}</p>
        </div>
    );
};

export default Page;