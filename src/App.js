import './App.css';
import { useEffect, useState } from 'react';
import { Roll } from './math/roll';

function getColor(i) {
	return [
		'#FE2712',
		'#FC600A',
		'#FB9902',
		'#FCCC1A',
		'#FEFE33',
		'#66B032',
		'#347C98',
		'#0247FE',
		'#4424D6',
		'#8601AF',
		'#C21460',
	][i];
}

const isInverted = () => window.innerHeight > window.innerWidth;
const getClassName = (...classNames) => classNames.filter(v => v).join(' ');

const useInverted = () => {
	const [inverted, setInverted] = useState(isInverted);
	useEffect(() => {
		const update = () => setInverted(isInverted);
		window.addEventListener('resize', update);

		return () => window.removeEventListener('resize', update);
	}, []);

	return inverted;
};

function App() {
	const [roll] = useState(() => new Roll());
	const [isLoading, setIsLoading] = useState(false);
	const [currentNumber, setCurrentNumber] = useState(0);
	const [animValue, setAnimValue] = useState(0);
	const inverted = useInverted();

	const next = () => {
		if (isLoading) {
			return;
		}
		setIsLoading(true);
		setAnimValue(0.15);
		setTimeout(() => setAnimValue(0.85), 500);
		setTimeout(() => {
			setAnimValue(0);
			setIsLoading(false);
			setCurrentNumber(roll.roll());
		}, 1000);
	};

	return (
		<div className={getClassName('App', inverted && 'inverted')}>
			<div className='disclaimer'>ANTI SCAM KUBI</div>
			<div className='field' onClick={next}>
				{isLoading && <div className='roll' />}
				{!isLoading && <div className='roll-result'>{currentNumber || '?'}</div>}
			</div>
			<div
				className={getClassName('line', inverted && 'inverted')}
				style={{ [inverted ? 'top' : 'left']: (animValue || roll.randomValue) * 100 + '%' }}
			/>
			<div className={getClassName('pivots', inverted && 'inverted')}>
				{roll.pivots.slice(1).map((v, i) => (
					<div
						key={i}
						className='number'
						style={{
							flex: (v - roll.pivots[i]) * 100,
							background: getColor(i),
						}}
					>
						<div>{i + 2}</div>
						<span>{roll.history.filter(v => v === i + 2).length}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
