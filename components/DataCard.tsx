import BoxIcon from '@/assets/icons/BoxIcon'
import React from 'react'

export default function DataCard({ data, fullWidth = false }: { data: any, fullWidth?: boolean }) {
    return (
        <div className={`${fullWidth ? 'w-full' : 'w-[350px]'} h-[150px] rounded-xl bg-[#D9D9D9] border-l-[14px] border-[#741FFF] flex  ${fullWidth ? 'justify-start pl-10' : 'justify-center'} items-center`}>
            <div className={`flex items-center gap-5`}>
                <BoxIcon />
                {fullWidth ? (
                    <div className='flex flex-col'>
                        <div className='flex flex-col text-[22px] text-[#45496A] font-semibold font-poppins'>
                            <p className=''>{data?.title}</p>
                        </div>
                        <div className='flex items-center gap-2 text-[22px] text-[#45496A] font-semibold font-poppins'>
                            <p className=''>Variants :</p>
                            <span className='text-[#0F8BFD] '>{data?.variants}</span>
                        </div>
                        <div className='flex items-center gap-2 text-[22px] text-[#45496A] font-semibold font-poppins'>
                            <p className=''>Total Count :</p>
                            <span className='text-[#0F8BFD] '>{data?.totalCount}</span>
                        </div>
                    </div>
                )
                    :
                    <div className='flex flex-col text-[22px] text-[#45496A] font-semibold font-poppins'>
                        <p className=''>{data?.title}</p>
                        <span>{data?.value}</span>
                    </div>
                }
            </div>
        </div>
    )
}
