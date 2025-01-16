import { Breath } from '~/routes/breath';

const toTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export interface ErrorProps {
  error: string;
}

const Error = (props: ErrorProps) => {
  const { error } = props;

  return <div className='text-sm text-red '>{error}</div>;
};

export interface FieldProps {
  name: Breath | string;
  updateBreath: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const Field = (props: FieldProps) => {
  const { name, updateBreath, error } = props;

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center pb-1'>
        <label className='underline underline-offset-2' htmlFor={name}>
          {toTitleCase(name)}:
        </label>
        <input
          onChange={updateBreath}
          className={`rounded w-14 text-lg ml-3 px-1 border ${
            error ? ' text-red border-red' : 'border-slate-200'
          }`}
          name={name}
          type='number'
          min={1}
        />
      </div>
      {error && <Error key={error} error={error} />}
    </div>
  );
};

export default Field;
