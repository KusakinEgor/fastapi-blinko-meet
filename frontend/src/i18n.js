import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          home: {
            login: "Login",
            meetings: "Meetings",
            create_meeting: "Create a meeting",
            schedule_title: "Schedule a meeting",
            schedule_desc: "up to 100 participants",
            join_meeting: "Join the meeting",
            login_title: "Log in",
            login_description: " to manage your<br/>meetings and see it's<br/>history",
            sign_in_btn: "Sign in as an employee"
          },
        },
      },
      ru: {
        translation: {
          home: {
            login: "Войти",
            meetings: "Встречи",
            create_meeting: "Создать встречу",
            schedule_title: "Запланировать встречу",
            schedule_desc: "до 100 участников",
            join_meeting: "Присоединиться к встрече",
            login_title: "Войдите",
            login_description: " чтобы управлять своими<br/>встречами и видеть их<br/>историю",
            sign_in_btn: "Войти как сотрудник"
          },
        },
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

