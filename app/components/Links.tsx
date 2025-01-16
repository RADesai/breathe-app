import { Link } from 'react-router';

const linkClass =
  'bg-white p-1 rounded h-44 w-44 flex flex-col justify-between text-sm font-bold justify-around px-2 shadow-orange group';

interface Formula {
  name: string;
  timing: string;
  description?: string;
  cycles: number;
  link: string;
}

const getMockFormula = (
  name: string,
  timing: string,
  cycles: number,
  link: string,
  description?: string
) => ({
  name,
  timing,
  cycles,
  link,
  description
});

const mockFormulas: Formula[] = [
  getMockFormula(
    'Feeling anxious',
    '3-0-6-2',
    4,
    'i3r0e6s2c4',
    'Reduce anxiety and promote a sense of calm'
  ),
  getMockFormula(
    'Energize',
    '3-2-6-0',
    6,
    'i3r2e6s0c6',
    'Boost energy levels and increase alertness.'
  ),
  getMockFormula(
    'Calm your nerves',
    '3-2-3-2',
    5,
    'i3r2e3s2c5',
    'Soothe and calm your nervous system.'
  ),
  getMockFormula(
    'Rest & relax',
    '3-0-6-3',
    8,
    'i3r0e6s3c8',
    'Rest deeply and relax your body and mind'
  ),
  getMockFormula('Box Breathing 3x3', '3-3-3-3', 3, 'i3r3e3s3c3', ''),
  getMockFormula('Box Breathing 4x4', '4-4-4-4', 4, 'i4r4e4s4c4', ''),
  getMockFormula('Box Breathing 5x5', '5-5-5-5', 5, 'i5r5e5s5c5', ''),
  getMockFormula('Box Breathing 6x6', '6-6-6-6', 6, 'i6r6e6s6c6', ''),
  getMockFormula('Box Breathing 7x7', '7-7-7-7', 7, 'i7r7e7s7c7', ''),
  getMockFormula('Box Breathing 8x8', '8-8-8-8', 8, 'i8r8e8s8c8', '')
];

function formatTime(seconds: number) {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${
      minutes > 1 ? 's' : ''
    } ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }
}

const Links = () => {
  return (
    <div className='border-b-2 border-dark'>
      <div className='p-2 flex justify-center'>
        <div className='flex flex-wrap gap-4 max-w-screen-md justify-center text-center'>
          {mockFormulas.map((formula) => (
            <Link
              key={formula.link}
              className={linkClass}
              to={`/breath/${formula.link}`}
            >
              <div className='title font-semibold text-lg group-hover:underline group-focus:underline'>
                {formula.name}
              </div>
              <div className='duration font-light'>{formula.description}</div>
              <div className='duration tracking-widest font-light'>
                {formula.timing}{' '}
                <div className='text-xs font-bold'>x{formula.cycles}</div>
              </div>
              <div className='duration align-bottom text-right text-xs font-light'>
                {formatTime(
                  formula?.timing
                    .split('-')
                    .reduce(
                      (total: number, num: string) => total + parseInt(num, 10),
                      0
                    ) * formula?.cycles
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Links;
