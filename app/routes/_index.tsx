import Info from '~/components/Info';
import Links from '~/components/Links';
import Nav from '~/components/Nav';

export default function Index() {
  return (
    <div className='flex justify-center flex-col'>
      <Nav />
      <Links />
      <Info />
    </div>
  );
}
