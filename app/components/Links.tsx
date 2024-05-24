import { Link } from '@remix-run/react';

const linkClass =
  'bg-white p-1 rounded h-40 w-40 flex flex-col justify-between text-sm font-bold uppercase justify-around px-2 shadow-[#94E4FF]';

interface Formula {
  name?: string;
  description?: string;
  cycles?: number;
  link?: string;
}

const getMockFormula = (
  name?: string,
  description?: string,
  cycles?: number,
  link?: string
) => ({
  name,
  description,
  cycles,
  link
});

const mockFormulas: Formula[] = [
  getMockFormula('Box Breathing 3x3', '3-3-3-3', 3, 'i3r3e3s3'),
  getMockFormula('Box Breathing 4x4', '4-4-4-4', 4, 'i4r4e4s4'),
  getMockFormula('Box Breathing 5x5', '5-5-5-5', 5, 'i5r5e5s5'),
  getMockFormula('Box Breathing 6x6', '6-6-6-6', 6, 'i6r6e6s6'),
  getMockFormula('Box Breathing 7x7', '7-7-7-7', 7, 'i7r7e7s7'),
  getMockFormula('Box Breathing 8x8', '8-8-8-8', 8, 'i8r8e8s8'),
  getMockFormula('Standard', '5-3-5-3', 3, 'i5r3e5s3'),
  getMockFormula('Standard v2', '6-4-6-4', 4, 'i6r4e6s4'),
  getMockFormula('Standard v3', '7-5-7-5', 4, 'i7r5e7s5'),
  getMockFormula('Standard v3', '8-6-8-6', 4, 'i8r6e8s6')
];

const Links = () => {
  return (
    <div className='flex flex-wrap gap-4 max-w-screen-md justify-center'>
      {mockFormulas.map((formula) => (
        <Link
          key={formula.link}
          className={linkClass}
          to={`/breath/${formula.link}`}
        >
          <div className='title font-semibold'>{formula.name}</div>
          <div className='duration tracking-widest text-center font-light'>
            {formula.description}
          </div>
          <div className='frequency align-bottom text-right text-sm font-bold'>
            x{formula.cycles}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Links;
