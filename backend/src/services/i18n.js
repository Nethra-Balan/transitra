/**
 * Internationalization (i18n) Service
 * Handles multi-language support for Transitra
 */

export const translations = {
  en: {
    // Common
    app_name: 'Transitra',
    home: 'Home',
    logout: 'Logout',
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',

    // Auth
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone',
    create_account: 'Create Account',
    already_account: 'Already have an account?',
    no_account: "Don't have an account?",

    // Route Planning
    plan_route: 'Plan Your Route',
    from: 'From',
    to: 'To',
    search_routes: 'Search Routes',
    find_routes: 'Find Routes',
    fastest_route: 'Fastest Route',
    cheapest_route: 'Cheapest Route',
    accessible_route: 'Most Accessible',
    least_walking: 'Least Walking',
    duration: 'Duration',
    fare: 'Fare',
    distance: 'Distance',
    walking_distance: 'Walking Distance',
    stops: 'Stops',
    wheelchair_accessible: 'Wheelchair Accessible',

    // Results
    routes_found: 'Routes Found',
    no_routes: 'No routes available',
    route: 'Route',
    minutes: 'min',
    km: 'km',

    // Saved Routes
    saved_routes: 'Saved Routes',
    save_route: 'Save Route',
    add_to_favorites: 'Add to Favorites',
    remove_from_favorites: 'Remove from Favorites',
    route_name: 'Route Name',
    route_description: 'Description',

    // Accessibility
    accessibility: 'Accessibility',
    wheelchair_mode: 'Wheelchair Mode',
    font_size: 'Font Size',
    dark_mode: 'Dark Mode',
    high_contrast: 'High Contrast',

    // Voice
    voice_assistant: 'Voice Assistant',
    start_listening: 'Start Listening',
    stop_listening: 'Stop Listening',
    say_destination: 'Say your destination...',
    voice_not_supported: 'Voice not supported on your browser',

    // Languages
    english: 'English',
    tamil: 'Tamil',
  },

  ta: {
    // Common
    app_name: 'ட்ரான்சிட்ரா',
    home: 'முகப்பு',
    logout: 'வெளியேறு',
    settings: 'அமைப்புகள்',
    save: 'சேமிக்கவும்',
    cancel: 'ரத்து செய்யவும்',
    loading: 'சுமை படுகிறது...',
    error: 'பிழை',
    success: 'வெற்றி',

    // Auth
    login: 'உள்நுழைவு',
    signup: 'பதிவு செய்யவும்',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    name: 'பெயர்',
    phone: 'ফোன்',
    create_account: 'கணக்கு உருவாக்கவும்',
    already_account: 'ஏற்கனவே கணக்கு உள்ளதா?',
    no_account: 'கணக்கு இல்லையா?',

    // Route Planning
    plan_route: 'உங்கள் பாதையை திட்டமிடுங்கள்',
    from: 'இருந்து',
    to: 'க்கு',
    search_routes: 'பாதைகளைத் தேடுங்கள்',
    find_routes: 'பாதைகளைக் கண்டுபிடிக்கவும்',
    fastest_route: 'வேகமான பாதை',
    cheapest_route: 'மலிவான பாதை',
    accessible_route: 'மிக அணுகக்கூடிய',
    least_walking: 'குறைந்த நடை',
    duration: 'கால அளவு',
    fare: 'கட்டணம்',
    distance: 'தூரம்',
    walking_distance: 'நடக்கும் தூரம்',
    stops: 'நிறுத்தங்கள்',
    wheelchair_accessible: 'சக்கர நாற்கால் அணுகக்கூடிய',

    // Results
    routes_found: 'பாதைகள் கிடைத்தன',
    no_routes: 'பாதைகள் கிடைக்கவில்லை',
    route: 'பாதை',
    minutes: 'நிமி',
    km: 'கிமீ',

    // Saved Routes
    saved_routes: 'சேமிக்கப்பட்ட பாதைகள்',
    save_route: 'பாதையை சேமிக்கவும்',
    add_to_favorites: 'விருப்பங்களில் சேர்க்கவும்',
    remove_from_favorites: 'விருப்பங்களிலிருந்து நீக்கவும்',
    route_name: 'பாதை பெயர்',
    route_description: 'விளக்கம்',

    // Accessibility
    accessibility: 'அணுகல்தன்மை',
    wheelchair_mode: 'சக்கர நாற்கால் முறை',
    font_size: 'எழுத்து அளவு',
    dark_mode: 'இருண்ட முறை',
    high_contrast: 'உচ்च மாறுபாடு',

    // Voice
    voice_assistant: 'குரல் உதவியாளர்',
    start_listening: 'கேட்க தொடங்குங்கள்',
    stop_listening: 'கேட்பதை நிறுத்துங்கள்',
    say_destination: 'உங்கள் இலக்கை சொல்லுங்கள்...',
    voice_not_supported: 'உங்கள் உலாவியில் குரல் ஆதரிக்கப்படவில்லை',

    // Languages
    english: 'ஆங்கிலம்',
    tamil: 'தமிழ்',
  },
};

export const i18nService = {
  /**
   * Get translation for a key in specified language
   */
  t(key, language = 'en') {
    return translations[language]?.[key] || translations.en[key] || key;
  },

  /**
   * Get all translations for a language
   */
  getLanguage(language = 'en') {
    return translations[language] || translations.en;
  },

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return Object.keys(translations).map((lang) => ({
      code: lang,
      name: translations[lang].english || lang,
    }));
  },

  /**
   * Format number for language (currency, etc.)
   */
  formatNumber(number, language = 'en') {
    if (language === 'ta') {
      return number.toLocaleString('ta-IN');
    }
    return number.toLocaleString('en-US');
  },

  /**
   * Format date for language
   */
  formatDate(date, language = 'en') {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    if (language === 'ta') {
      return new Date(date).toLocaleDateString('ta-IN', options);
    }
    return new Date(date).toLocaleDateString('en-US', options);
  },
};
