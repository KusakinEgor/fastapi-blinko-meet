import { EMOJI_CATEGORIES } from "./emojiMap";

const FLAT_EMOJI_MAP = Object.values(EMOJI_CATEGORIES).reduce((acc, category) => {
	Object.entries(category).forEach(([key, value]) => {
		if (value && value.src) {
			acc[key] = { src: value.src, alt: value.alt || key };
		}
	});

	return acc;
}, {});

export function parseMessage(text) {
	const regex = /:([a-z0-9_]+):/gi;
	const result = [];
	let lastIndex = 0;
	let match;
	let key = 0;

	while ((match = regex.exec(text)) !== null) {
		const emojiName = match[1];
		const emoji = FLAT_EMOJI_MAP[emojiName];

		const start = match.index;
		const end = regex.lastIndex;

		if (start > lastIndex) {
			result.push(text.slice(lastIndex, start));
		}

		if (emoji) {
			result.push(
				<img
					key={`emoji-${key++}`}
					src={emoji.src}
					alt={emoji.alt}
					className={"inline mx-1 align-middle w-8 h-8"}
				/>
			);
		} else {
			result.push(text.slice(start, end));
		}

		lastIndex = end;
	}

	if (lastIndex < text.length) {
		result.push(text.slice(lastIndex));
	}

	return result;
}
