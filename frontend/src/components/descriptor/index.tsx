import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';
import { DescriptorProps } from "./types"

export const Descriptor = ({ field, value, call, obj }: DescriptorProps) => {
  const [data, setData] = useState(value);

  const retrieveData = async () => {
    const resp = await call?.();
    setData(resp);
  }

  useEffect(() => {
    if (call != null) retrieveData();
    setData(value);
  }, [obj])

  return (
    <div className={styles.description}>
      <p>{field}: {data}</p>
    </div>
  )
}