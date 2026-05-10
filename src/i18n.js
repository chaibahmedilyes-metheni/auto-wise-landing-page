import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      "app_name": "Auto Wise",
      "app_tagline": "Drive, Connect, Service",

      // Navigation
      "nav_home": "Accueil",
      "nav_features": "Avantages",
      "nav_how": "Comment ça marche",
      "nav_app": "L'application",
      "nav_register": "Rejoindre la liste",
      "nav_faq": "FAQ",

      // Hero
      "hero_title": "L'avenir de l'entretien automobile en Algérie",
      "hero_subtitle": "Trouvez des garages vérifiés, réservez en un clic, et suivez chaque réparation avec des preuves photo. La confiance automobile, réinventée.",
      "hero_cta_primary": "Rejoindre en tant que client",
      "hero_cta_secondary": "Rejoindre en tant que garage",
      "hero_badge": "Lancement bientôt en Algérie",
      "hero_trust_1": "Garages vérifiés",
      "hero_trust_2": "Preuves photo",
      "hero_trust_3": "100% transparent",

      // Stats
      "stat_garages": "Garages partenaires",
      "stat_cities": "Wilayas couvertes",
      "stat_waitlist": "En liste d'attente",
      "stat_satisfaction": "Satisfaction prévue",

      // Features
      "features_label": "Avantages",
      "features_title": "Pourquoi choisir Auto Wise ?",
      "features_subtitle": "Une plateforme pensée pour simplifier et sécuriser votre expérience automobile.",
      "feature_1_title": "Garages Vérifiés & Certifiés",
      "feature_1_desc": "Chaque garage de notre réseau est inspecté et certifié. Nous garantissons la qualité du service que vous recevez.",
      "feature_2_title": "Documentation Photo",
      "feature_2_desc": "Recevez des photos avant et après chaque intervention. Fini les doutes sur le travail réalisé.",
      "feature_3_title": "Réservation Intelligente",
      "feature_3_desc": "Prenez rendez-vous en quelques secondes. Comparez les garages, consultez les avis et choisissez le créneau qui vous convient.",
      "feature_4_title": "Historique Complet",
      "feature_4_desc": "Accédez à l'historique complet d'entretien de votre véhicule. Ne perdez plus jamais une facture ou un rapport de service.",
      "feature_5_title": "Prix Transparent",
      "feature_5_desc": "Recevez des devis clairs avant chaque intervention. Pas de surprises, pas de frais cachés.",
      "feature_6_title": "Support Dédié",
      "feature_6_desc": "Notre équipe est disponible pour vous accompagner à chaque étape. Votre satisfaction est notre priorité.",

      // How it Works
      "how_label": "Comment ça marche",
      "how_title": "Simple comme 1, 2, 3",
      "how_subtitle": "De la recherche à la réparation, tout est fluide et transparent.",
      "how_step_1_title": "Trouvez votre garage",
      "how_step_1_desc": "Parcourez les garages vérifiés près de chez vous. Filtrez par service, note et distance.",
      "how_step_2_title": "Réservez en un clic",
      "how_step_2_desc": "Choisissez le créneau idéal et confirmez votre rendez-vous instantanément.",
      "how_step_3_title": "Suivez en temps réel",
      "how_step_3_desc": "Recevez des mises à jour avec photos et validez le travail effectué.",

      // App Preview
      "app_label": "L'application",
      "app_title": "Découvrez l'expérience Auto Wise",
      "app_subtitle": "Une application mobile pensée pour les conducteurs algériens. Interface intuitive, navigation fluide, contrôle total.",
      "app_feature_1": "Recherche de garages par proximité",
      "app_feature_2": "Réservation de créneaux en temps réel",
      "app_feature_3": "Suivi d'entretien avec preuves photo",
      "app_feature_4": "Tableau de bord personnalisé",
      "app_coming_soon": "Bientôt disponible sur",

      // For Garages
      "garage_label": "Espace Garage",
      "garage_title": "Développez votre activité avec Auto Wise",
      "garage_subtitle": "Rejoignez le réseau de garages les plus fiables d'Algérie et attirez de nouveaux clients.",
      "garage_benefit_1_title": "Visibilité maximale",
      "garage_benefit_1_desc": "Apparaissez en tête des recherches locales et attirez des clients qui cherchent exactement vos services.",
      "garage_benefit_2_title": "Gestion simplifiée",
      "garage_benefit_2_desc": "Gérez vos rendez-vous, votre planning et vos clients depuis un seul tableau de bord intelligent.",
      "garage_benefit_3_title": "Réputation vérifiée",
      "garage_benefit_3_desc": "Construisez une réputation solide grâce aux avis clients et au système de preuves photo.",
      "garage_cta": "Inscrire mon garage",

      // Trust
      "trust_label": "Confiance",
      "trust_title": "La transparence au cœur de tout",
      "trust_subtitle": "Chaque interaction sur Auto Wise est conçue pour renforcer la confiance entre clients et garages.",
      "trust_item_1": "Garages inspectés et certifiés",
      "trust_item_2": "Preuves photo obligatoires",
      "trust_item_3": "Avis clients vérifiés",
      "trust_item_4": "Devis transparent avant intervention",
      "trust_item_5": "Support client réactif",
      "trust_item_6": "Protection des données personnelles",

      // Registration
      "form_title": "Rejoignez l'avant-première",
      "form_subtitle": "Soyez parmi les premiers à découvrir Auto Wise lors du lancement officiel.",
      "tab_customer": "Je suis un client",
      "tab_garage": "Je suis un garage",
      "label_name": "Nom complet",
      "label_phone": "Numéro de téléphone",
      "label_email": "Adresse email",
      "label_state": "Wilaya",
      "label_workshop": "Nom du garage",
      "placeholder_name": "Entrez votre nom complet",
      "placeholder_phone": "ex: 0550 123 456",
      "placeholder_email": "votre@email.com",
      "placeholder_state": "Sélectionnez votre wilaya",
      "placeholder_workshop": "Nom de votre garage",
      "btn_submit": "Rejoindre la liste d'attente",
      "btn_submitting": "Inscription en cours...",
      "success_title": "Bienvenue dans la communauté !",
      "success_msg": "Votre inscription est confirmée. Vous recevrez un email de bienvenue sous peu.",
      "success_back": "Retour",
      "error_msg": "Une erreur est survenue. Veuillez réessayer.",
      "validation_required": "Ce champ est requis",
      "validation_email": "Adresse email invalide",
      "form_secure": "Vos données sont protégées et ne seront jamais partagées.",

      // FAQ
      "faq_label": "FAQ",
      "faq_title": "Questions fréquentes",
      "faq_subtitle": "Tout ce que vous devez savoir sur Auto Wise.",
      "faq_1_q": "Qu'est-ce qu'Auto Wise ?",
      "faq_1_a": "Auto Wise est une plateforme technologique qui connecte les propriétaires de véhicules avec des garages certifiés en Algérie. Nous simplifions la réservation, le suivi et la documentation de l'entretien automobile.",
      "faq_2_q": "Quand sera disponible l'application ?",
      "faq_2_a": "L'application est actuellement en phase finale de développement. Inscrivez-vous à la liste d'attente pour être informé en premier lors du lancement officiel.",
      "faq_3_q": "Comment les garages sont-ils vérifiés ?",
      "faq_3_a": "Chaque garage partenaire passe par un processus de vérification rigoureux incluant une inspection sur site, une vérification des qualifications et un engagement qualité.",
      "faq_4_q": "L'inscription est-elle gratuite ?",
      "faq_4_a": "Oui, l'inscription à la liste d'attente est entièrement gratuite. Vous recevrez un accès prioritaire lors du lancement.",
      "faq_5_q": "Dans quelles wilayas sera disponible Auto Wise ?",
      "faq_5_a": "Le lancement initial couvrira les principales wilayas d'Algérie, avec une expansion progressive sur l'ensemble du territoire national.",

      // Footer
      "footer_copy": "© 2026 Auto Wise. Tous droits réservés.",
      "footer_tagline": "Drive, Connect, Service",
      "footer_description": "La plateforme automobile intelligente pour l'Algérie. Connecter les conducteurs avec des garages de confiance.",
      "footer_links_title": "Liens rapides",
      "footer_contact_title": "Contact",
      "footer_contact_email": "contact@autowise-dz.com",
      "footer_legal": "Mentions légales",
      "footer_privacy": "Politique de confidentialité",
    }
  },
  ar: {
    translation: {
      "app_name": "Auto Wise",
      "app_tagline": "قُد، تواصل، صيانة",

      // Navigation
      "nav_home": "الرئيسية",
      "nav_features": "المميزات",
      "nav_how": "كيف يعمل",
      "nav_app": "التطبيق",
      "nav_register": "انضم للقائمة",
      "nav_faq": "الأسئلة",

      // Hero
      "hero_title": "مستقبل صيانة السيارات في الجزائر",
      "hero_subtitle": "اعثر على ورشات معتمدة، احجز بنقرة واحدة، وتابع كل إصلاح بالصور. الثقة في عالم السيارات، أُعيد ابتكارها.",
      "hero_cta_primary": "انضم كعميل",
      "hero_cta_secondary": "انضم كورشة",
      "hero_badge": "إطلاق قريب في الجزائر",
      "hero_trust_1": "ورشات معتمدة",
      "hero_trust_2": "توثيق بالصور",
      "hero_trust_3": "شفافية تامة",

      // Stats
      "stat_garages": "ورشة شريكة",
      "stat_cities": "ولاية مغطاة",
      "stat_waitlist": "في قائمة الانتظار",
      "stat_satisfaction": "رضا متوقع",

      // Features
      "features_label": "المميزات",
      "features_title": "لماذا تختار Auto Wise؟",
      "features_subtitle": "منصة مصممة لتبسيط وتأمين تجربتك في صيانة السيارات.",
      "feature_1_title": "ورشات معتمدة ومُعتَرف بها",
      "feature_1_desc": "كل ورشة في شبكتنا تم فحصها واعتمادها. نضمن لك جودة الخدمة التي تتلقاها.",
      "feature_2_title": "توثيق بالصور",
      "feature_2_desc": "احصل على صور قبل وبعد كل تدخل. لا مزيد من الشكوك حول العمل المنجز.",
      "feature_3_title": "حجز ذكي",
      "feature_3_desc": "احجز موعدك في ثوانٍ. قارن بين الورشات، اطلع على التقييمات واختر الموعد المناسب.",
      "feature_4_title": "سجل صيانة كامل",
      "feature_4_desc": "اطلع على سجل الصيانة الكامل لمركبتك. لن تفقد أبدًا فاتورة أو تقرير خدمة.",
      "feature_5_title": "أسعار شفافة",
      "feature_5_desc": "احصل على عروض أسعار واضحة قبل كل تدخل. بدون مفاجآت، بدون رسوم خفية.",
      "feature_6_title": "دعم مخصص",
      "feature_6_desc": "فريقنا متاح لمرافقتك في كل خطوة. رضاك هو أولويتنا.",

      // How it Works
      "how_label": "كيف يعمل",
      "how_title": "بسيط كـ 1، 2، 3",
      "how_subtitle": "من البحث إلى الإصلاح، كل شيء سلس وشفاف.",
      "how_step_1_title": "ابحث عن ورشتك",
      "how_step_1_desc": "تصفح الورشات المعتمدة القريبة منك. فلتر حسب الخدمة والتقييم والمسافة.",
      "how_step_2_title": "احجز بنقرة واحدة",
      "how_step_2_desc": "اختر الموعد المثالي وأكد حجزك فورًا.",
      "how_step_3_title": "تابع في الوقت الحقيقي",
      "how_step_3_desc": "استلم تحديثات بالصور وتحقق من العمل المنجز.",

      // App Preview
      "app_label": "التطبيق",
      "app_title": "اكتشف تجربة Auto Wise",
      "app_subtitle": "تطبيق موبايل مصمم للسائقين الجزائريين. واجهة بديهية، تنقل سلس، تحكم كامل.",
      "app_feature_1": "البحث عن ورشات قريبة",
      "app_feature_2": "حجز مواعيد في الوقت الحقيقي",
      "app_feature_3": "متابعة الصيانة بالصور",
      "app_feature_4": "لوحة تحكم مخصصة",
      "app_coming_soon": "قريبًا على",

      // For Garages
      "garage_label": "فضاء الورشة",
      "garage_title": "طوّر نشاطك مع Auto Wise",
      "garage_subtitle": "انضم إلى شبكة أكثر الورشات موثوقية في الجزائر واجذب عملاء جدد.",
      "garage_benefit_1_title": "رؤية قصوى",
      "garage_benefit_1_desc": "اظهر في مقدمة نتائج البحث المحلية واجذب عملاء يبحثون عن خدماتك بالتحديد.",
      "garage_benefit_2_title": "إدارة مبسطة",
      "garage_benefit_2_desc": "أدر مواعيدك وجدولك وعملاءك من لوحة تحكم ذكية واحدة.",
      "garage_benefit_3_title": "سمعة موثقة",
      "garage_benefit_3_desc": "ابنِ سمعة قوية من خلال تقييمات العملاء ونظام التوثيق بالصور.",
      "garage_cta": "سجل ورشتي",

      // Trust
      "trust_label": "الثقة",
      "trust_title": "الشفافية في صميم كل شيء",
      "trust_subtitle": "كل تفاعل على Auto Wise مصمم لتعزيز الثقة بين العملاء والورشات.",
      "trust_item_1": "ورشات مفحوصة ومعتمدة",
      "trust_item_2": "صور توثيقية إلزامية",
      "trust_item_3": "تقييمات عملاء موثقة",
      "trust_item_4": "عرض أسعار شفاف قبل التدخل",
      "trust_item_5": "دعم عملاء متجاوب",
      "trust_item_6": "حماية البيانات الشخصية",

      // Registration
      "form_title": "انضم للإطلاق الأولي",
      "form_subtitle": "كن من أوائل المستفيدين عند الإطلاق الرسمي لـ Auto Wise.",
      "tab_customer": "أنا عميل",
      "tab_garage": "أنا صاحب ورشة",
      "label_name": "الاسم الكامل",
      "label_phone": "رقم الهاتف",
      "label_email": "البريد الإلكتروني",
      "label_state": "الولاية",
      "label_workshop": "اسم الورشة",
      "placeholder_name": "أدخل اسمك الكامل",
      "placeholder_phone": "مثال: 0550 123 456",
      "placeholder_email": "بريدك@email.com",
      "placeholder_state": "اختر ولايتك",
      "placeholder_workshop": "اسم ورشتك",
      "btn_submit": "انضم لقائمة الانتظار",
      "btn_submitting": "جاري التسجيل...",
      "success_title": "مرحبًا بك في المجتمع!",
      "success_msg": "تم تأكيد تسجيلك. ستتلقى بريدًا ترحيبيًا قريبًا.",
      "success_back": "عودة",
      "error_msg": "حدث خطأ. يرجى المحاولة مرة أخرى.",
      "validation_required": "هذا الحقل مطلوب",
      "validation_email": "بريد إلكتروني غير صالح",
      "form_secure": "بياناتك محمية ولن تتم مشاركتها أبدًا.",

      // FAQ
      "faq_label": "الأسئلة الشائعة",
      "faq_title": "أسئلة شائعة",
      "faq_subtitle": "كل ما تحتاج معرفته عن Auto Wise.",
      "faq_1_q": "ما هو Auto Wise؟",
      "faq_1_a": "Auto Wise هي منصة تقنية تربط أصحاب المركبات بورشات معتمدة في الجزائر. نبسّط الحجز والمتابعة وتوثيق صيانة السيارات.",
      "faq_2_q": "متى سيكون التطبيق متاحًا؟",
      "faq_2_a": "التطبيق حاليًا في المرحلة النهائية من التطوير. سجل في قائمة الانتظار لتكون أول من يعلم عند الإطلاق الرسمي.",
      "faq_3_q": "كيف يتم التحقق من الورشات؟",
      "faq_3_a": "كل ورشة شريكة تمر بعملية تحقق صارمة تشمل فحصًا ميدانيًا والتحقق من المؤهلات والتزامًا بمعايير الجودة.",
      "faq_4_q": "هل التسجيل مجاني؟",
      "faq_4_a": "نعم، التسجيل في قائمة الانتظار مجاني تمامًا. ستحصل على وصول أولوي عند الإطلاق.",
      "faq_5_q": "في أي ولايات سيكون Auto Wise متاحًا؟",
      "faq_5_a": "سيغطي الإطلاق الأولي الولايات الرئيسية في الجزائر، مع توسع تدريجي ليشمل كامل التراب الوطني.",

      // Footer
      "footer_copy": "© 2026 Auto Wise. جميع الحقوق محفوظة.",
      "footer_tagline": "قُد، تواصل، صيانة",
      "footer_description": "المنصة الذكية للسيارات في الجزائر. نربط السائقين بورشات موثوقة.",
      "footer_links_title": "روابط سريعة",
      "footer_contact_title": "تواصل معنا",
      "footer_contact_email": "contact@autowise-dz.com",
      "footer_legal": "الشروط القانونية",
      "footer_privacy": "سياسة الخصوصية",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // Default to Arabic
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
