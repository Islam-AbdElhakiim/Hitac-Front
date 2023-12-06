import React from 'react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import Button from './Button'
import { MdModeEdit } from 'react-icons/md'

export default function PalletCard({ data }: { data: any }) {
    return (
        <div className='w-[585px] h-full rounded-xl bg-[#D9D9D9]  flex flex-col justify-between items-center p-[22px] gap-4 border-l-[14px] border-[#741FFF]'>
            <div className='flex justify-between items-center w-full '>
                <h4 className='text-[18px] text-[#414042] font-bold font-poppins'>{data?._id}</h4>

            </div>
            <div className='grid grid-cols-2 justify-between items-center w-full gap-x-4 gap-y-4	'>
                <div className='flex gap-2 text-[14px]'>
                    <p className='font-medium text-[#676B89] '>Patch :</p>
                    <p className='text-[#0F8BFD] truncate'>{data?.patch}</p>
                </div>
                <div className='flex gap-2 text-[14px]'>
                    <p className='font-medium text-[#676B89] '>Product :</p>
                    <p className='text-[#0F8BFD] truncate'>{data?.product}</p>
                </div>
                <div className='flex gap-2 text-[14px]'>
                    <p className='font-medium text-[#676B89] '>Box Weight :</p>
                    <p className='text-[#0F8BFD] truncate'>  {data?.boxWeight}</p>
                </div>
                <div className='flex gap-2 text-[14px]'>
                    <p className='font-medium text-[#676B89] '>Boxes Per Base :</p>
                    <p className='text-[#0F8BFD] truncate'> {data?.boxesPerBase}</p>
                </div>
                <div className='flex gap-2 text-[14px]'>
                    <p className='font-medium text-[#676B89] '>Boxes Per Column :</p>
                    <p className='text-[#0F8BFD] truncate'> {data?.boxesPerColumn}</p>
                </div>
                <div className='flex gap-2 text-[14px]'>
                    <p className='font-medium text-[#676B89] '>Total Boxes :</p>
                    <p className='text-[#0F8BFD] truncate'> {data?.totalBoxes}</p>
                </div>

                {/* <div className='flex gap-2 text-[18px]'>
                    <p className='font-medium text-[#676B89] '>Color Grade :</p>
                    <p className='text-[#0F8BFD]'>orange-45</p>
                </div>
                <div className='flex gap-2 text-[18px]'>
                    <p className='font-medium text-[#676B89] '>Fridge :</p>
                    <p className='text-[#0F8BFD]'> 201</p>
                </div>
                <div className='flex gap-2 text-[18px]'>
                    <p className='font-medium text-[#676B89] '>Size :</p>
                    <p className='text-[#0F8BFD]'>56</p>
                </div> */}

            </div>
        </div>
    )
}
