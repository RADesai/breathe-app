// FORM
const label = `font-cherry`;
const input = `py-2 px-3 border text-md border-dark border-opacity-50 drop-shadow rounded-lg`;
const inputError = `${input} border-red bg-red bg-opacity-20`;

// BUTTONS
const submitButton = `border border-opacity-10 hover:border-opacity-100 py-2 px-3 w-full rounded-lg border-dark bg-purple justify-items-center text-center text-white hover:underline`;
const outlineButton = `border border-opacity-40 hover:border-opacity-100 py-2 px-3 w-full rounded-lg border-purple justify-items-center text-center hover:underline`;

// LINKS
const link = `text-purple hover:underline font-bold`;

// STATUS
const statusBox = `border-2 w-full bg-dark bg-opacity-80 p-2 border-dark text-dark text-sm font-bold rounded`;
const error = `${statusBox} bg-red border-red`;
const success = `${statusBox} bg-green border-green`;

// ANIMATION
const controlButton = `bg-pink text-white rounded p-2 mt-2 mb-4 tracking-widest flex justify-between items-center shadow hover:shadow-pink disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`;

// TYPOGRAPHY
const header = `font-bold tracking-widest uppercase text-2xl text-purple`;
const paragraph = `text-dark tracking-wide`;

export const formStyles = {
  label,
  input,
  inputError,
  submitButton,
  outlineButton,
  link,
  error,
  success
};

export const animationStyles = {
  controlButton
};

export const typographyStyles = {
  header,
  paragraph
};

// ? using clsx
// import clsx from 'clsx';

// const baseButton = 'py-2 px-4 rounded-lg text-white';
// const primaryButton = 'bg-blue-500 hover:bg-blue-700';
// const disabledButton = 'opacity-50 cursor-not-allowed';

// export const styles = {
//   button: (isPrimary: boolean, isDisabled: boolean) =>
//     clsx(baseButton, isPrimary && primaryButton, isDisabled && disabledButton),
// };

// import { styles } from './styles';

// export default function Button({ isPrimary, isDisabled, label }: Props) {
//   return (
//     <button className={styles.button(isPrimary, isDisabled)} disabled={isDisabled}>
//       {label}
//     </button>
//   );
// }
