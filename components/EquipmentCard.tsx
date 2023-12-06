import React from 'react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import Button from './Button'
import { MdModeEdit } from 'react-icons/md'
import { useRouter } from 'next/router';
import Image from "next/image";
import Box from '../assets/imgs/box.png'

export default function EquipmentCard({ id = '1' }: { id: string }) {
    const router = useRouter();

    return (
        <div className='w-[600px] h-full rounded-md bg-[#D9D9D9]  flex  justify-between items-center p-[35px] gap-10'>
            <div className='flex justify-between items-center '>
                <Image
                    src={Box}
                    alt="employee-image"
                />
            </div>
            <div className='flex flex-col justify-start items-start w-full gap-6'>
                <h4 className='text-[26px] text-[#414042] font-bold font-poppins'>Cartoon Boxes</h4>
                <div className='grid grid-cols-2 justify-between items-center w-full'>
                    <div className='flex gap-2 text-[18px]'>
                        <p className='font-medium text-[#676B89] '>Total Available :</p>
                        <p className='text-[#0F8BFD]'>364</p>
                    </div>
                    <div className='flex gap-2 text-[18px]'>
                        <p className='font-medium text-[#676B89] '>Available Variants :</p>
                        <p className='text-[#0F8BFD]'>10</p>
                    </div>


                </div>
            </div>
        </div>
    )
}
