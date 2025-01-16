import Bar from '~/components/Bar';
import Info from '~/components/Info';
import Links from '~/components/Links';
import Nav from '~/components/Nav';

export default function Index() {
  return (
    <div className="flex flex-col justify-center">
      <Nav />
      <Bar title="Samples" className="bg-white text-pink" />
      <Links />
      <Info />
    </div>
  );
}
