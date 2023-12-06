import React, { useState } from 'react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import Button from './Button'
import { MdModeEdit } from 'react-icons/md'
import { useRouter } from 'next/router';
import MyModal from './MyModal';
import { HIDE_LOADER, SHOW_LOADER } from '@/redux/modules/loader-slice';
import { deletepatchById } from '@/http/patchesHttp';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

export default function PatchCard({ data }: { data: any }) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>();
    const [modalBody, setModalBody] = useState<string>();
    const [ifTrue, setIfTrue] = useState<() => void>(() => { });


    const deletePatch = (name: string, _id: any) => {
        //popup modal
        const deletes = async () => {
            dispatch(SHOW_LOADER());
            try {
                await deletepatchById(_id);
                router.push(`/inventory/products/in-stock`);
            } catch (e) {
            } finally {
                dispatch(HIDE_LOADER());

            }
        };
        setModalTitle(`Are you sure?`);
        setModalBody(
            `Are you sure you want to delete ${name} from Hitac database?`
        );
        setIsOpen(true);
        setIfTrue(() => deletes);
    };
    return (
        <>
            <div className='w-[600px] h-full rounded-md bg-[#D9D9D9]  flex flex-col justify-between items-center p-[22px] gap-4'>
                <div className='flex justify-between items-center w-full '>
                    <h4 className='text-[22px] text-[#414042] font-bold font-poppins'>{data?._id}</h4>
                    <div className='flex'>
                        <Button
                            icon={
                                <span className="text-[#828894] text-xl group-hover:text-[#B1B1B1] transition">
                                    <MdModeEdit />
                                </span>
                            }
                            classes="p-0 m-0 bg-transparent group transition"
                            handleOnClick={(e: any) => {
                                e.stopPropagation();
                                e.preventDefault();
                                router.push(`/inventory/products/in-stock/${data?._id}?isEdit=true`);

                            }}
                        />
                        <Button
                            icon={
                                <span className="text-[#828894] text-xl group-hover:text-[#B1B1B1] transition">
                                    <RiDeleteBin6Line />
                                </span>
                            }
                            classes="p-0 m-0 bg-transparent group transition"
                            handleOnClick={(e: any) => {
                                e.stopPropagation();
                                e.preventDefault();
                                deletePatch(data?._id, data?._id);
                            }
                            }
                        />
                    </div>
                </div>
                <div className='grid grid-cols-2 justify-between items-center w-full gap-x-4 gap-y-4	'>

                    <div className='flex gap-2 text-[16px]'>
                        <p className='font-medium text-[#676B89] '>Station :</p>
                        <p className='text-[#0F8BFD] truncate'>{data?.station?.englishName}</p>
                    </div>
                    <div className='flex gap-2 text-[16px]'>
                        <p className='font-medium text-[#676B89] '>Supplier :</p>
                        <p className='text-[#0F8BFD] truncate'>{data?.suppliers.map((res: any) => `${res.firstName} ${res.lastName}`).join(',')}</p>
                    </div>
                    <div className='flex gap-2 text-[16px]'>
                        <p className='font-medium text-[#676B89] '>Total Pallets :</p>
                        <p className='text-[#0F8BFD] truncate'>{data?.totalPallets}</p>
                    </div>

                    <div className='flex gap-2 text-[16px] '>
                        <p className='font-medium text-[#676B89] '>Quality-Specialist :</p>
                        <p className='text-[#0F8BFD] truncate		'>{data?.qualitySpecialist?.firstName} {data?.qualitySpecialist?.lastName}</p>
                    </div>
                    <div className='flex gap-2 text-[16px]'>
                        <p className='font-medium text-[#676B89] '>Operation :</p>
                        <p className='text-[#0F8BFD] truncate'>{data?.operation?.firstName} {data?.operation?.lastName}</p>
                    </div>

                </div>
            </div>
            <MyModal
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                title={modalTitle}
                body={modalBody}
                ifTrue={ifTrue}
            />
        </>
    )
}
