import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';



/**
 * emps =>
 * consistent the API DTOs
 * create one
 * update set disabled if more than one is selected and when select route
 * delete popup modal and create api request then route to emps
 * filter => role + modules btns and update the list localy
 * 
 * emp
 * delete => modal and create api request then route to emps
 * handle changing the emp by form
 * inverting modules from API
 * replace img with new when edit
 * when save update the API with loader
 * 
 * 
 */




export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  }
});


export default function Home(props: any) {
  const { t } = useTranslation('common', { bindI18n: 'languageChanged loaded' })

  // const router = useRouter();
  // router.push('employees'); 

  return (
    "this page is under future development for adding dashboards, upcoming work, and bird-eye view over the whole modules "
  )
}
