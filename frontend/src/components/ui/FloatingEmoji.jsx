import React, { useEffect, useState } from "react";

const FloatingEmoji = ({ emoji, onComplete }) => {
	const [randomX] = useState(() => Math.floor(Math.random() * 140) - 70);
	const [randomRotate] = useState(() => Math.floor(Math.random() * 60) - 30);

	return (
		<div
			onAnimationEnd={onComplete}
			className="fixed bottom-20 left-1/2 pointer-events-none text-5xl z-[100] animate-emoji-float select-none"
			style={{
				marginLeft: `${randomX}px`,
				'--rotation': `${randomRotate}deg`
			}}
		>
			{emoji}
		</div>
	);
};

export default FloatingEmoji;
