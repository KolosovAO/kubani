import './App.css';
import { useState } from 'react';
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

const useForceUpdate = () => {
	const [_, setV] = useState(0);
	return () => setV(v => v + 1);
};

const isInverted = () => window.innerHeight > window.innerWidth;
const getClassName = (className) => isInverted() ? className + ' inverted' : className;

function App() {
	const [roll] = useState(() => new Roll());
	const [isLoading, setIsLoading] = useState(false);
	const [currentNumber, setCurrentNumber] = useState(0);
	const [animValue, setAnimValue] = useState(0);
	const forceUpdate = useForceUpdate();
	const pivots = roll.lastPivots;

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
			setTimeout(() => {
				roll.updatePivots();
				forceUpdate();
			}, 1000);
		}, 1000);
	};

	return (
		<div className={getClassName('App')}>
			<div className='disclaimer'>ANTI SCAM KUBI</div>
			<div className='field' onClick={next}>
				{isLoading && <div className='roll' />}
				{!isLoading && <div className='roll-result'>{currentNumber || '?'}</div>}
			</div>
			<div
				className={getClassName('line')}
				style={{ [isInverted() ? 'top' : 'left']: (animValue || roll.lastRandom) * 100 + '%' }}
			/>
			<div className={getClassName('pivots')}>
				{pivots.slice(1).map((v, i) => (
					<div
						key={i}
						className='number'
						style={{
							flex: (v - pivots[i]) * 100,
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
