import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { TractData } from '@/pages/types';
import styles from '@/styles/Home.module.css';
import { Descriptor } from '../descriptor';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'name', headerName: 'TRACT NAME', flex: 3 },
  { field: 'lat', headerName: 'LAT', flex: 2 },
  { field: 'long', headerName: 'LONG', flex: 2 },
];

export const Grid = ({ tracts }: any) => {
  const Map = useMemo(
    () => dynamic(() => import("@/components/map/index"), { ssr: false }),
    []
  );

  const [detailIsLoading, setDetailIsLoading] = useState<boolean>(false);
  const [tractDetail, setTractDetail] = useState<TractData|null>(null);
  
  const loadTractDetail = async (id: string): Promise<void> => {
    setDetailIsLoading(true);
    setTractDetail(null);
    const data = await (await fetch(`api/tracts/${id}`)).json();
    setTractDetail(data);
    setDetailIsLoading(false);
  }

  const getState = async (id?: string): Promise<string|undefined> => {
    if (!id) return;
    const data = await (await fetch(`https://api.census.gov/data/2010/dec/sf1?get=NAME&for=state:${id}`)).json();
    return data[1][0];
  }

  const getCounty = async (state?: string, county?: string): Promise<string|undefined> => {
    if (!state || !county) return;
    const data = await (await fetch(`https://api.census.gov/data/2010/dec/sf1?get=NAME&for=county:${county}&in=state:${state}`)).json();
    return data[1][0].split(',')[0];
  }

  return (
    <>
      <section className={styles.contents}>
        <Box sx={{ height: 400, width: '45vw' }}>
          <DataGrid
            rows={tracts}
            columns={columns}
            onRowClick={(params) => loadTractDetail(params.row.id)}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 15,
                },
              },
            }}
            sx={{
              '& .MuiDataGrid-row ': { cursor: 'pointer' },
            }}
          />
        </Box>
        
        {detailIsLoading && (
          <CircularProgress className={styles.centered} />
        )}

        {tractDetail != null && !detailIsLoading && (
            <Map tractDetail={tractDetail} />
          )}
      </section>
      <section className={styles.content}>
        <Descriptor field={'State'} obj={tractDetail} call={() => getState(tractDetail?.state_fips)} />
        <Descriptor field={'County'} obj={tractDetail} call={() => getCounty(tractDetail?.state_fips, tractDetail?.county_fips)} />
        <Descriptor field={'Total Area'} obj={tractDetail} value={tractDetail?.area} />
        <Descriptor field={'Area Land'} obj={tractDetail} value={tractDetail?.area_land} />
        <Descriptor field={'Area Water'} obj={tractDetail} value={tractDetail?.area_water} />
      </section>
    </>
  )
}
