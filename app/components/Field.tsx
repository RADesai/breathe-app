import { Breath } from '~/routes/breath';

const toTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export interface FieldProps {
  name: Breath | string;
  updateBreath: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field = (props: FieldProps) => {
  const { name, updateBreath } = props;
    // todo: prop -> errors.type input ""
  return (
    <div className='flex justify-between'>
      <label
        className='underline underline-offset-2'
        htmlFor={name}
      >
        {toTitleCase(name)}:
      </label>
      <input
        onChange={updateBreath}
        className='rounded w-16 ml-3 bg-slate-200'
        name={name}
        type='number'
        min={1}
      />
    </div>
  );
};

export default Field;
