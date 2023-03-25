export type DescriptorProps = {
  field: string;
  value?: string|number;
  call?: () => Promise<string|undefined>;
  obj: any;
}
