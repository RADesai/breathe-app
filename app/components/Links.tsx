import { Link } from '@remix-run/react';

const linkClass =
  'bg-white p-1 rounded h-40 w-40 flex flex-col justify-between text-sm font-bold justify-around px-2 shadow-[#94E4FF]';

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
  getMockFormula('Feeling anxious', '3-0-6-2', 4, 'i3r0e6s2c4'),
  getMockFormula('Energize', '3-2-6-0', 6, 'i3r2e6s0c6'),
  getMockFormula('Calm your nerves', '3-2-3-2', 5, 'i3r2e3s2c5'),
  getMockFormula('Rest & relax', '3-0-6-3', 8, 'i3r0e6s3c8'),
  getMockFormula('Box Breathing 3x3', '3-3-3-3', 3, 'i3r3e3s3c3'),
  getMockFormula('Box Breathing 4x4', '4-4-4-4', 4, 'i4r4e4s4c4'),
  getMockFormula('Box Breathing 5x5', '5-5-5-5', 5, 'i5r5e5s5c5'),
  getMockFormula('Box Breathing 6x6', '6-6-6-6', 6, 'i6r6e6s6c6'),
  getMockFormula('Box Breathing 7x7', '7-7-7-7', 7, 'i7r7e7s7c7'),
  getMockFormula('Box Breathing 8x8', '8-8-8-8', 8, 'i8r8e8s8c8'),
  getMockFormula('Quick', '3-1-3-1', 2, 'i3r1e3s1c2')
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
            Cycles: x{formula.cycles}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Links;
