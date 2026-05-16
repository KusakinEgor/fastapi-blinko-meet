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
            sign_in_btn: "Sign in as an employee",
			sign_in_as_an_user: "Sign as an user",
			account: "Account",
			go_to_profile: "Go to Profile",
			logout: "Log Out"
          },
		  auth: {
			  login_credentials: "Login credentials",
			  enter_your_data: "Enter your account login and password",
			  username_or_email: "Username or Email",
			  password: "Password",
			  reset_password: "Rest Password",
			  login: "Log In",
			  authenticating: "Authenticating..."
		  },
		  login_user: {
			  welcome_back: "Welcome Back",
			  enter_your_data: "Enter your email and password",
			  email_add: "Email address",
			  password: "Password",
			  reset_password: "Reset Password",
			  login: "Log In",
			  no_account: "Don't have an account?",
			  create_one: "Create one"
		  },
		  register_user: {
			  create_account: "Create account",
			  join_the_com: "Join the community and start meetings",
			  username: "Username",
			  email_add: "Email address",
			  password: "Password",
			  sign_up: "Sign Up",
			  already_account: "Already have an account?",
			  login: "Log In"
		  },
		  schedule: {
			  schedule_meeting: "Schedule a meeting",
			  meeting_title: "Meeting title",
			  schedule: "Schedule",
			  cancel: "Cancel",
			  title: "Video meeting scheduled",
			  subtitle: "Send the link to the participants and join at any time",
			  link_label: "Video meeting link",
			  copy_btn: "Copy invitation"
		  },
		  room_preview: {
			  back: "Back",
			  camera_proh: "Camera prohibited",
			  allow: "Allow",
			  new_video: "New video meeting",
			  your_name: "Your name",
			  meeting_title: "Meeting title",
			  create_and_join: "Create and Join"
		  },
		  join_preview: {
			  title: "Introduce yourself to the meeting participants",
			  name_placeholder: "Your name",
			  code_placeholder: "Video Meeting Code",
			  password_placeholder: "Video Meeting Password",
			  submit_btn: "Join the Meeting"
		  },
		  profile: {
			  back_btn: "Back",
			  settings_btn: "Settings",
			  role_user: "User",
			  status_hidden: "hidden",
			  badges_title: "Badges",
			  badge_pioneer: "Pioneer",
			  badge_speaker: "Speaker",
			  badge_active: "Active",
			  badge_detective: "Detective",
			  events_counter: "Events",
			  likes_counter: "Likes",
			  activity_title: "Activity",
			  search_placeholder: "Search profiles"
		  },
		  meeting_room: {
			  waiting: "Waiting...",
			  participants_count: "0 participants",
			  no_participants: "No other participants...",
			  invite_btn: "Invite to meeting",
			  nav_participants: "Participants",
			  nav_chat: "Chat",
			  nav_screen: "Screen",
			  nav_reactions: "Reactions",
			  nav_more: "More",
			  leave_btn: "Leave",
			  you: "You",
			  no_messages: "No messages yet...",
			  enter_message_placeholder: "Enter message",
			  leave_confirm_title: "Leave meeting",
			  stay_btn: "Stay",
			  raise_hand: "Raise hand",
			  record_meeting: "Record meeting",
			  stop_recording: "Stop recording",
			  participants_list_title: "Participants"
		  },
		  ai_summary: {
			  badge: "AI Analysis",
			  title: "Summary",
			  error_title: "No summary found",
			  error_desc: "Try to generate it after the meeting",
			  back_btn: "Back to Lobby"
		  }
        },
      },
      ru: {
        translation: {
          home: {
            login: "Войти",
            meetings: "Встречи",
            create_meeting: "Создать встречу", schedule_title: "Запланировать встречу",
            schedule_desc: "до 100 участников",
            join_meeting: "Присоединиться к встрече",
            login_title: "Войдите",
            login_description: " чтобы управлять своими<br/>встречами и видеть их<br/>историю",
            sign_in_btn: "Войти как сотрудник",
			sign_in_as_an_user: "Войти как пользователь",
			account: "Аккаунт",
			go_to_profile: "Перейти в профиль",
			logout: "Выйти",
          },
		  auth: {
			  login_credentials: "Данные для входа",
			  enter_your_data: "Введите логин и пароль отвашей учетной записи",
			  username_or_email: "Имя пользователя или Email",
			  password: "Пароль",
			  reset_password: "Сбросить пароль",
			  login: "Войти",
			  authenticating: "Вход в систему..."
		  },
		  login_user: {
			  welcome_back: "С возвращением",
			  enter_your_data: "Введите ваш email и пароль",
			  email_add: "Email адрес",
			  password: "Пароль",
			  reset_password: "Сбросить пароль",
			  login: "Войти",
			  no_account: "Нет аккаунта?",
			  create_one: "Создайте его"
		  },
		  register_user: {
			  create_account: "Создать аккаунт",
			  join_the_com: "Присоединяйтесь к сообществу и начинайте встречи",
			  username: "Имя пользователя",
			  email_add: "Email адрес",
			  password: "Пароль",
			  sign_up: "Зарегистрироваться",
			  already_account: "Уже есть аккаунт?",
			  login: "Войти"
		  },
		  schedule: {
			  schedule_meeting: "Запланировать встречу",
			  meeting_title: "Название встречи",
			  schedule: "Создать",
			  cancel: "Отмена",
			  title: "Видеовстреча запланирована",
			  subtitle: "Отправьте ссылку участникам встречи и подключайтесь в любое время",
			  link_label: "Адрес видеовстречи",
			  copy_btn: "Скопировать приглашение"
		  },
		  room_preview: {
			  back: "Назад",
			  camera_proh: "Камера заблокирована",
			  allow: "Разрешить",
			  new_video: "Новая видеовстреча",
			  your_name: "Ваше имя",
			  meeting_title: "Название встречи",
			  create_and_join: "Создать и войти"
		  },
		  join_preview: {
			  title: "Представьтесь участникам встречи",
			  name_placeholder: "Ваше имя",
			  code_placeholder: "Код видеовстречи",
			  password_placeholder: "Пароль видеовстречи",
			  submit_btn: "Присоединиться к встрече"
		  },
		  profile: {
			  back_btn: "Назад",
			  settings_btn: "Настройки",
			  role_user: "Пользователь",
			  status_hidden: "скрыто",
			  badges_title: "Достижения",
			  badge_pioneer: "Первопроходец",
			  badge_speaker: "Спикер",
			  badge_active: "Активный",
			  badge_detective: "Детектив",
			  events_counter: "Мероприятия",
			  likes_counter: "Лайки",
			  activity_title: "Активность",
			  search_placeholder: "Поиск профилей"
		  },
		  meeting_room: {
			  waiting: "Ожидание...",
			  participants_count: "0 участников",
			  no_participants: "Других участников нет...",
			  invite_btn: "Пригласить на встречу",
			  nav_participants: "Участники",
			  nav_chat: "Чат",
			  nav_screen: "Экран",
			  nav_reactions: "Реакции",
			  nav_more: "Ещё",
			  leave_btn: "Выйти",
			  you: "Вы",
			  no_messages: "Сообщений пока нет...",
			  enter_message_placeholder: "Введите сообщение",
			  leave_confirm_title: "Покинуть встречу",
			  stay_btn: "Остаться",
			  raise_hand: "Поднять руку",
			  record_meeting: "Записать встречу",
			  stop_recording: "Остановить запись",
			  participants_list_title: "Участники"
		  },
		  ai_summary: {
			  badge: "ИИ-анализ",
			  title: "Итоги встречи",
			  error_title: "Итоги не найдены",
			  error_desc: "Попробуйте сгенерировать их после окончания встречи",
			  back_btn: "Вернуться в лобби"
		  }
        },
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

