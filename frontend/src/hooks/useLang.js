import { useTranslation } from "react-i18next";

export function useLang() {
	const { t, i18n } = useTranslation();

	const isRussian = i18n.language?.startsWith("ru");

	const toggleLanguage = () => {
		const newLang = isRussian ? "en" : "ru";
		i18n.changeLanguage(newLang);
	};

	return { t, i18n, isRussian, toggleLanguage };
}
