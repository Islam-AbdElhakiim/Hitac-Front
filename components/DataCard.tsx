import BoxIcon from '@/assets/icons/BoxIcon'
import React from 'react'

export default function DataCard({ data, fullWidth = false }: { data: any, fullWidth?: boolean }) {
    return (
        <div className={`${fullWidth ? 'w-full' : 'w-[350px]'} h-[150px] rounded-xl bg-[#D9D9D9] border-l-[14px] border-[#741FFF] flex  ${fullWidth ? 'justify-start pl-10' : 'justify-center'} items-center`}>
            <div className={`flex items-center gap-5`}>
                <BoxIcon />
                <div className='flex flex-col text-[22px] text-[#45496A] font-semibold font-poppins'>
                    <p className=''>{data?.product}</p>
                    <span>{data?.count}</span>
                </div>
            </div>
        </div>
    )
}
