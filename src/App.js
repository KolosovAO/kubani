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

const isInverted = () => window.innerHeight > window.innerWidth;
const getClassName = (className) => isInverted() ? className + ' inverted' : className;

function App() {
	const [roll] = useState(() => new Roll());
	const [isLoading, setIsLoading] = useState(false);
	const [currentNumber, setCurrentNumber] = useState(0);
	const pivots = roll.getPivots();
	const next = () => {
		if (!currentNumber) {
			setIsLoading(false);
			setCurrentNumber(roll.roll());
		}
		if (isLoading) {
			return;
		}
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			setCurrentNumber(roll.roll());
		}, 1000);
	};
	console.log(roll.history)
	return (
		<div className={getClassName('App')}>
			<div className='field' onClick={next}>
				{isLoading && <div className='roll' />}
				{!isLoading && <div className='roll-result'>{currentNumber || '?'}</div>}
			</div>
			<div
				className={getClassName('line' + (isLoading ? ' loading' : ''))}
				style={isLoading ? undefined : { [isInverted() ? 'top' : 'left']: roll.lastRandom * 100 + '%' }}
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
						<span>{Math.floor(Number((v - pivots[i]).toFixed(3)) * 1000) / 10}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
