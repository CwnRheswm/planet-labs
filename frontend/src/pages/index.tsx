
import styles from '@/styles/Home.module.css';
import { LoadingButton } from '@mui/lab';
import Head from 'next/head';
import React, { useState } from 'react';
import { TractData } from './types';
import { Grid } from '@/components/grid';

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tractData, setTractData] = useState<TractData[]|null>(null);
  
  const loadTractData = async () => {
    setIsLoading(true);
    const resp = await fetch('api/tracts');
    const data = await resp.json();
    setTractData(data);
    setIsLoading(false);
  }
    
  return (
    <>
      <Head>
        <title>Planet Labs Take Home</title>
        <meta name="description" content="Planet Labs Take Home" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={`${styles.description} ${styles.center}`}>
          <p>
            Welcome to the Census Tracts explorer!
          </p>
        </div>
  
        <LoadingButton onClick={() => loadTractData()} variant="contained" loading={isLoading} disabled={tractData != null}>Load Tract Data</LoadingButton>

        {tractData != null && (
          <Grid tracts={tractData} />
        )}
      </main>
    </>
  )
}

export default Home;