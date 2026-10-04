const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const keys = {
  en: {
    navDiscover: 'Discover', navGames: 'Games', navFilms: 'Films', navLibrary: 'My library', signIn: 'Sign in',
    heroEyebrow: 'GOOD STORIES. GOOD PEOPLE.', heroTitle: 'Find your<br>next <em>favorite.</em>', heroText: 'A handpicked world of games and films, made by people who care.',
    exploreCollection: 'Explore the collection', heroFootnote: 'Independent creators. Official sources. Always.', heroCaption: 'PICKED FOR THE CURIOUS',
    curatedForYou: 'A LITTLE INSPIRATION', collectionTitle: 'Worth a closer look', collectionNote: 'Good things, gathered in one place.',
    searchPlaceholder: 'Search titles, genres, creators…', allStories: 'Everything', games: 'Games', films: 'Films', sortBy: 'Sort',
    featured: 'Featured', topRated: 'Top rated', newest: 'Newest', sourceNote: 'Every link leads to its creator or rights holder.',
    nothingFound: 'No stories found', tryAnother: 'Try a different search or filter.', clearFilters: 'Clear filters →',
    manifestoEyebrow: 'THE SORA PROMISE', manifestoTitle: 'A good story should<br>have a <em>good source.</em>',
    manifestoText: 'We connect you directly to creators and rights holders. No mystery links, no guesswork—just more room for the stories you love.',
    yourCollection: 'YOUR COLLECTION', libraryTitle: 'Your library', historyEmpty: 'Your story starts here',
    historyEmptyText: 'Items you visit will appear in your collection.', footerText: 'A home for stories worth sharing.',
    footerRights: 'Respect creators. Always.', welcomeBack: 'WELCOME TO SORA', authTitle: 'Stories are better<br>when they’re yours.',
    authText: 'Sign in to save your favorites and keep your collection close.', createAccount: 'Create account',
    yourName: 'Your name', emailAddress: 'Email address', password: 'Password', yourList: 'YOUR LIST',
    savedItems: 'Saved stories', listNote: 'Your list is saved on this device. Downloads always open at the official source.',
    adminDashboard: 'ADMIN DASHBOARD', adminTitle: 'A little overview', gamesLabel: 'Games', filmsLabel: 'Films',
    yourAccount: 'YOUR ACCOUNT', profileTitle: 'Make yourself at home.', languagePreference: 'Language preference', saveChanges: 'Save changes', signOut: 'Sign out',
    addToList: 'Save for later', removeFromList: 'Remove saved item', getFromSource: 'Visit official source', reviews: 'Reviews',
    rateThis: 'Rate this story', writeReview: 'Share a thought…', postReview: 'Post review', signInToReview: 'Sign in to leave a review',
    addedToList: 'Saved to your list.', removedFromList: 'Removed from your list.', signInFirst: 'Sign in to save your download history.',
    sourceOpened: 'Opening the official source in a new tab.', reviewSaved: 'Thanks for sharing your thoughts.',
    noReviews: 'No reviews yet. Be the first to share a thought.', noSavedItems: 'Nothing saved just yet.',
    accountUpdated: 'Profile updated.', loggedOut: 'You’ve signed out.', genericError: 'Something went wrong. Please try again.',
    rating: 'Rating', downloads: 'Downloads', users: 'Users', catalog: 'Catalog'
  },
  ar: {
    navDiscover: 'اكتشف', navGames: 'الألعاب', navFilms: 'الأفلام', navLibrary: 'مكتبتي', signIn: 'تسجيل الدخول',
    heroEyebrow: 'حكايات جميلة. وأشخاص رائعون.', heroTitle: 'اكتشف <em>حكايتك</em><br>القادمة.', heroText: 'عالم مختار بعناية من الألعاب والأفلام، صنعه أشخاص يهتمون بالتفاصيل.',
    exploreCollection: 'استكشف المجموعة', heroFootnote: 'مبدعون مستقلون. مصادر رسمية دائماً.', heroCaption: 'اختيرت لمحبي الاكتشاف',
    curatedForYou: 'قليل من الإلهام', collectionTitle: 'تستحق اكتشافها', collectionNote: 'أشياء جميلة، في مكان واحد.',
    searchPlaceholder: 'ابحث عن العناوين والأنواع…', allStories: 'الكل', games: 'ألعاب', films: 'أفلام', sortBy: 'ترتيب',
    featured: 'مميزة', topRated: 'الأعلى تقييماً', newest: 'الأحدث', sourceNote: 'كل رابط يوصلك إلى صانع العمل أو صاحب الحقوق.',
    nothingFound: 'لم نعثر على نتائج', tryAnother: 'جرّب كلمات أو فلاتر مختلفة.', clearFilters: 'مسح الفلاتر ←',
    manifestoEyebrow: 'وعد سورا', manifestoTitle: 'الحكاية الجميلة<br>تستحق <em>مصدراً موثوقاً.</em>',
    manifestoText: 'نوصلك مباشرة إلى المبدعين وأصحاب الحقوق. بلا روابط مجهولة، وبلا تخمين—فقط مساحة أكبر للحكايات التي تحبها.',
    yourCollection: 'مجموعتك', libraryTitle: 'مكتبتك', historyEmpty: 'حكايتك تبدأ من هنا',
    historyEmptyText: 'الأعمال التي تزورها ستظهر في مجموعتك.', footerText: 'مكان للحكايات التي تستحق المشاركة.',
    footerRights: 'احترم المبدعين دائماً.', welcomeBack: 'أهلاً بك في سورا', authTitle: 'الحكايات أجمل<br>حين تكون لك.',
    authText: 'سجّل الدخول لحفظ مفضلاتك والاحتفاظ بمجموعتك.', createAccount: 'إنشاء حساب',
    yourName: 'الاسم', emailAddress: 'البريد الإلكتروني', password: 'كلمة المرور', yourList: 'قائمتك',
    savedItems: 'حكايات محفوظة', listNote: 'تُحفظ قائمتك على هذا الجهاز. الروابط تفتح المصدر الرسمي دائماً.',
    adminDashboard: 'لوحة الإدارة', adminTitle: 'نظرة سريعة', gamesLabel: 'الألعاب', filmsLabel: 'الأفلام',
    yourAccount: 'حسابك', profileTitle: 'أهلاً بك في مساحتك.', languagePreference: 'اللغة المفضلة', saveChanges: 'حفظ التغييرات', signOut: 'تسجيل الخروج',
    addToList: 'احفظها لاحقاً', removeFromList: 'أزل من المحفوظات', getFromSource: 'زيارة المصدر الرسمي', reviews: 'التقييمات',
    rateThis: 'قيّم هذا العمل', writeReview: 'شاركنا رأيك…', postReview: 'إرسال التقييم', signInToReview: 'سجّل الدخول لإضافة تقييم',
    addedToList: 'أُضيفت إلى قائمتك.', removedFromList: 'أُزيلت من قائمتك.', signInFirst: 'سجّل الدخول لحفظ سجل التنزيلات.',
    sourceOpened: 'نفتح المصدر الرسمي في نافذة جديدة.', reviewSaved: 'شكراً لمشاركة رأيك.',
    noReviews: 'لا توجد تقييمات بعد. كن أول من يشارك رأيه.', noSavedItems: 'لا توجد عناصر محفوظة حالياً.',
    accountUpdated: 'تم تحديث الملف الشخصي.', loggedOut: 'تم تسجيل الخروج.', genericError: 'حدث خطأ. حاول مرة أخرى.',
    rating: 'التقييم', downloads: 'التنزيلات', users: 'المستخدمون', catalog: 'المجموعة'
  }
};

const catalog = [
  { id: 1, slug: '0-ad', title: '0 A.D.', titleAr: '0 A.D.', type: 'game', genre: 'Strategy', year: 2025, description: 'Build a civilization, manage resources, and lead your people through a richly detailed historical strategy game.', descriptionAr: 'ابنِ حضارة وأدر الموارد وقُد شعبك في لعبة استراتيجية تاريخية غنية بالتفاصيل.', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85', size: '2.5 GB', quality: 'HD · PC', platform: 'Windows · macOS · Linux', sourceUrl: 'https://play0ad.com/download/', sourceName: 'Official 0 A.D. website', license: 'Open source · GPL', featured: true, rating: 4.8, reviewCount: 24 },
  { id: 2, slug: 'xonotic', title: 'Xonotic', titleAr: 'Xonotic', type: 'game', genre: 'Action', year: 2024, description: 'A fast-paced arena shooter with fluid movement, polished maps, and a passionate open-source community.', descriptionAr: 'لعبة تصويب سريعة في ساحات القتال، بحركة سلسة وخرائط متقنة ومجتمع مفتوح المصدر.', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=85', size: '1.8 GB', quality: 'HD · PC', platform: 'Windows · macOS · Linux', sourceUrl: 'https://www.xonotic.org/download/', sourceName: 'Official Xonotic website', license: 'Open source · GPL', featured: true, rating: 4.7, reviewCount: 18 },
  { id: 3, slug: 'supertuxkart', title: 'SuperTuxKart', titleAr: 'سوبر تاكس كارت', type: 'game', genre: 'Racing', year: 2024, description: 'A cheerful open-source kart racer featuring colorful tracks, memorable characters, and local multiplayer.', descriptionAr: 'لعبة سباق كارت مفتوحة المصدر بمسارات ملونة وشخصيات مميزة ولعب جماعي محلي.', imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85', size: '1.2 GB', quality: 'HD · PC', platform: 'Windows · macOS · Linux · Android', sourceUrl: 'https://supertuxkart.net/Download', sourceName: 'Official SuperTuxKart website', license: 'Open source · GPL', featured: false, rating: 4.5, reviewCount: 11 },
  { id: 4, slug: 'big-buck-bunny', title: 'Big Buck Bunny', titleAr: 'الأرنب الكبير', type: 'movie', genre: 'Animation', year: 2008, description: 'A charming animated short created by the Blender Institute and released under a Creative Commons license.', descriptionAr: 'فيلم رسوم متحركة قصير ولطيف من إنتاج معهد بلندر، متاح بموجب ترخيص المشاع الإبداعي.', imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1000&q=85', size: '463 MB', quality: '1080p · MP4', platform: 'English · Subtitles available', sourceUrl: 'https://peach.blender.org/download/', sourceName: 'Blender Foundation', license: 'Creative Commons BY 3.0', featured: true, rating: 4.9, reviewCount: 38 },
  { id: 5, slug: 'sintel', title: 'Sintel', titleAr: 'سنتل', type: 'movie', genre: 'Fantasy', year: 2010, description: 'An independent fantasy short from the Blender Open Movie Project, freely shared by its creators.', descriptionAr: 'فيلم خيالي قصير مستقل من مشروع أفلام بلندر المفتوحة، متاح مجاناً من صانعيه.', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85', size: '1.1 GB', quality: '1080p · MP4', platform: 'English · Subtitles available', sourceUrl: 'https://durian.blender.org/download/', sourceName: 'Blender Foundation', license: 'Creative Commons BY 3.0', featured: false, rating: 4.6, reviewCount: 15 },
  { id: 6, slug: 'night-of-the-living-dead', title: 'Night of the Living Dead', titleAr: 'ليلة الموتى الأحياء', type: 'movie', genre: 'Horror', year: 1968, description: 'George A. Romero’s landmark independent horror film. Check the source listing for rights and availability in your region.', descriptionAr: 'فيلم الرعب المستقل الشهير لجورج روميرو. تحقّق من المصدر لمعرفة الحقوق والتوفر في منطقتك.', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=85', size: '1.4 GB', quality: '1080p · MP4', platform: 'English · Public-domain listing', sourceUrl: 'https://archive.org/details/night_of_the_living_dead', sourceName: 'Internet Archive', license: 'Public-domain listing · verify locally', featured: false, rating: 4.1, reviewCount: 9 }
];

let language = localStorage.getItem('sora-language') || 'en';
let theme = localStorage.getItem('sora-theme') || 'dark';
let activeType = 'all';
let activeGenre = '';
let searchTerm = '';
let sortBy = 'featured';
let selectedItem = null;
let authMode = 'login';
let user = null;
let token = sessionStorage.getItem('sora-token') || '';
let toastTimer;
let historyItems = JSON.parse(localStorage.getItem('sora-history') || '[]');
let savedItems = JSON.parse(localStorage.getItem('sora-list') || '[]');

function t(key) {
  return keys[language][key] ?? keys.en[key] ?? key;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: 'Bearer ' + token } : {}),
      ...options.headers
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || t('genericError'));
  return data;
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  localStorage.setItem('sora-language', language);
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  $$('.nav-link, .segment, [data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (key) element.innerHTML = t(key);
  });
  $$('[data-i18n-placeholder]').forEach(element => element.placeholder = t(element.dataset.i18nPlaceholder));
  $('.language-toggle').textContent = language === 'en' ? 'العربية' : 'English';
  renderCatalog();
  renderCart();
  if (selectedItem) renderDetail(selectedItem);
}

function setTheme(nextTheme) {
  theme = nextTheme;
  document.body.classList.toggle('light', theme === 'light');
  localStorage.setItem('sora-theme', theme);
  $('.theme-icon').textContent = theme === 'light' ? '☾' : '☼';
}

function displayTitle(item) {
  return language === 'ar' ? item.titleAr || item.title : item.title;
}

function displayDescription(item) {
  return language === 'ar' ? item.descriptionAr || item.description : item.description;
}

function visibleItems() {
  let items = catalog.filter(item => activeType === 'all' || item.type === activeType);
  if (activeGenre) items = items.filter(item => item.genre === activeGenre);
  if (searchTerm) {
    const query = searchTerm.toLocaleLowerCase();
    items = items.filter(item => [item.title, item.titleAr, item.description, item.genre, item.sourceName].some(value => value.toLocaleLowerCase().includes(query)));
  }
  return items.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'year') return b.year - a.year;
    return Number(b.featured) - Number(a.featured) || b.year - a.year;
  });
}

function renderGenres() {
  const genres = [...new Set(catalog.filter(item => activeType === 'all' || item.type === activeType).map(item => item.genre))].sort();
  $('#genre-filters').innerHTML = genres.map(genre => `<button class="genre-chip${activeGenre === genre ? ' active' : ''}" data-genre="${escapeHtml(genre)}">${escapeHtml(genre)}</button>`).join('');
}

function renderCatalog() {
  const items = visibleItems();
  renderGenres();
  $('#result-count').textContent = `${String(items.length).padStart(2, '0')} ${language === 'ar' ? 'أعمال' : 'stories'}`;
  $('#catalog-grid').hidden = items.length === 0;
  $('#empty-state').hidden = items.length > 0;
  $('#catalog-grid').innerHTML = items.map(item => {
    const isSaved = savedItems.includes(item.slug);
    const title = displayTitle(item);
    const type = item.type === 'game' ? t('games') : t('films');
    return `<article class="story-card" data-open="${escapeHtml(item.slug)}" tabindex="0" aria-label="${escapeHtml(title)}">
      <div class="story-cover">
        <img src="${escapeHtml(item.imageUrl)}" alt="" loading="lazy">
        <span class="story-type">${escapeHtml(type)}</span>
        <button class="save-button${isSaved ? ' saved' : ''}" data-save="${escapeHtml(item.slug)}" aria-label="${escapeHtml(isSaved ? t('removeFromList') : t('addToList'))}" title="${escapeHtml(isSaved ? t('removeFromList') : t('addToList'))}">${isSaved ? '♥' : '♡'}</button>
        <div class="cover-caption"><span>${escapeHtml(item.genre.toUpperCase())}</span><span class="rating"><span class="rating-star">★</span>${Number(item.rating).toFixed(1)}</span></div>
      </div>
      <div class="card-content"><div class="card-copy"><h3 class="card-title">${escapeHtml(title)}</h3><div class="card-meta"><span>${escapeHtml(String(item.year))}</span><i class="meta-dot"></i><span>${escapeHtml(item.size)}</span></div></div><span class="card-arrow" aria-hidden="true">↗</span></div>
    </article>`;
  }).join('');
}

function rememberVisit(item) {
  historyItems = [item.slug, ...historyItems.filter(slug => slug !== item.slug)].slice(0, 30);
  localStorage.setItem('sora-history', JSON.stringify(historyItems));
}

function openDetail(slug) {
  selectedItem = catalog.find(item => item.slug === slug);
  if (!selectedItem) return;
  rememberVisit(selectedItem);
  renderDetail(selectedItem);
  $('#detail-dialog').showModal();
  api(`/api/catalog/${encodeURIComponent(slug)}`).then(result => {
    if (result.item) {
      Object.assign(selectedItem, result.item);
      renderDetail(selectedItem, result.reviews || []);
    }
  }).catch(() => {});
}

function renderDetail(item, reviews = []) {
  const saved = savedItems.includes(item.slug);
  const title = displayTitle(item);
  const reviewEntries = reviews.length
    ? reviews.map(review => `<div class="review-entry"><strong>${escapeHtml(review.name)}</strong> · <span class="rating-star">★</span>${Number(review.rating)}<p>${escapeHtml(review.comment)}</p></div>`).join('')
    : `<div class="review-entry">${escapeHtml(t('noReviews'))}</div>`;
  $('#detail-content').innerHTML = `<div class="detail-hero" style="background-image:url('${escapeHtml(item.imageUrl)}')"></div>
    <div class="detail-body">
      <div class="eyebrow muted"><span class="eyebrow-line"></span><span>${escapeHtml(item.type === 'game' ? t('games') : t('films'))} · ${escapeHtml(item.genre)}</span></div>
      <h2>${escapeHtml(title)}</h2>
      <div class="detail-info"><span>${escapeHtml(String(item.year))}</span><span>${escapeHtml(item.size)}</span><span>${escapeHtml(item.quality)}</span><span>${escapeHtml(item.platform)}</span><span><span class="rating-star">★</span>${Number(item.rating).toFixed(1)} (${Number(item.reviewCount)} ${escapeHtml(t('reviews').toLowerCase())})</span></div>
      <p>${escapeHtml(displayDescription(item))}</p>
      <div class="license-note">${language === 'ar' ? 'الترخيص والمصدر: ' : 'License & source: '}${escapeHtml(item.license)} · ${escapeHtml(item.sourceName)}</div>
      <div class="detail-actions"><button class="button button-light" data-download="${escapeHtml(item.slug)}"><span>${escapeHtml(t('getFromSource'))}</span><span>↗</span></button>
      <button class="detail-secondary" data-save="${escapeHtml(item.slug)}">${escapeHtml(saved ? t('removeFromList') : t('addToList'))}</button></div>
      <h3 class="reviews-title">${escapeHtml(t('reviews'))}</h3>
      <form class="review-form" id="review-form"><select name="rating" aria-label="${escapeHtml(t('rating'))}"><option value="5">★★★★★</option><option value="4">★★★★☆</option><option value="3">★★★☆☆</option><option value="2">★★☆☆☆</option><option value="1">★☆☆☆☆</option></select><input name="comment" maxlength="1000" placeholder="${escapeHtml(t('writeReview'))}" aria-label="${escapeHtml(t('writeReview'))}"><button type="submit">${escapeHtml(user ? t('postReview') : t('signInToReview'))}</button></form>
      <div class="review-list">${reviewEntries}</div>
    </div>`;
  $('#review-form').addEventListener('submit', submitReview);
}

function renderCart() {
  const count = $('.cart-count');
  count.textContent = String(savedItems.length);
  count.hidden = savedItems.length === 0;
  const items = savedItems.map(slug => catalog.find(item => item.slug === slug)).filter(Boolean);
  $('#cart-list').innerHTML = items.length ? items.map(item => `<div class="side-item"><img src="${escapeHtml(item.imageUrl)}" alt=""><div class="side-item-copy"><strong>${escapeHtml(displayTitle(item))}</strong><span>${escapeHtml(item.genre)} · ${escapeHtml(item.size)}</span></div><button data-remove="${escapeHtml(item.slug)}" aria-label="${escapeHtml(t('removeFromList'))}">×</button></div>`).join('') : `<div class="empty-state"><p>${escapeHtml(t('noSavedItems'))}</p></div>`;
}

function toggleSaved(slug) {
  if (savedItems.includes(slug)) {
    savedItems = savedItems.filter(item => item !== slug);
    showToast(t('removedFromList'));
  } else {
    savedItems.push(slug);
    showToast(t('addedToList'));
  }
  localStorage.setItem('sora-list', JSON.stringify(savedItems));
  renderCatalog();
  renderCart();
  if (selectedItem) renderDetail(selectedItem);
}

function renderHistory(items = null) {
  const history = items ?? historyItems.map(slug => catalog.find(item => item.slug === slug)).filter(Boolean);
  $('#history-empty').hidden = history.length > 0;
  $('#history-list').innerHTML = history.map(item => {
    const title = displayTitle(item);
    return `<div class="history-item"><img src="${escapeHtml(item.imageUrl)}" alt=""><div class="history-copy"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(item.type)} · ${escapeHtml(item.genre)}</span></div><a href="#" data-open="${escapeHtml(item.slug)}">${escapeHtml(t('getFromSource'))} ↗</a></div>`;
  }).join('');
}

function setView(view) {
  $$('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.view === view || link.dataset.filter === activeType && view === 'discover'));
  const history = view === 'history';
  $('#discover').hidden = history;
  $('.editorial-banner').hidden = history;
  $('#library').hidden = !history;
  if (history) {
    if (user) {
      api('/api/me/downloads').then(result => {
        const items = result.items.map(entry => ({ ...entry, imageUrl: entry.image_url, type: entry.type }));
        renderHistory(items);
      }).catch(() => renderHistory());
    } else renderHistory();
    $('#library').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else $('#discover').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setAuthMode(mode) {
  authMode = mode;
  $$('.auth-tab').forEach(button => button.classList.toggle('active', button.dataset.authMode === mode));
  const nameField = $('[name="name"]');
  const passwordField = $('[name="password"]');
  nameField.hidden = mode !== 'register';
  nameField.required = mode === 'register';
  passwordField.autocomplete = mode === 'register' ? 'new-password' : 'current-password';
  $('#auth-form button[type="submit"]').textContent = t(mode === 'register' ? 'createAccount' : 'signIn');
  $('#auth-message').textContent = '';
}

function refreshAccount() {
  const label = $('.account-label');
  const avatar = $('.avatar');
  label.textContent = user?.name ?? t('signIn');
  avatar.textContent = user?.name?.slice(0, 1).toUpperCase() ?? 'S';
}

async function handleAccount() {
  if (user) {
    $('#profile-form [name="name"]').value = user.name;
    $('#profile-form [name="preferredLanguage"]').value = user.preferredLanguage || language;
    $('#profile-admin').hidden = user.role !== 'admin';
    $('#profile-message').textContent = '';
    $('#profile-dialog').showModal();
  } else {
    setAuthMode('login');
    $('#auth-dialog').showModal();
  }
}

async function submitProfile(event) {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  try {
    const result = await api('/api/me', {
      method: 'PATCH',
      body: JSON.stringify({ name: fields.get('name'), preferredLanguage: fields.get('preferredLanguage') })
    });
    user = { ...user, ...result.user };
    refreshAccount();
    if (user.preferredLanguage !== language) setLanguage(user.preferredLanguage);
    showToast(t('accountUpdated'));
  } catch (error) {
    $('#profile-message').textContent = error.message;
  }
}

async function submitAuth(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  const mode = authMode === 'register' ? 'register' : 'login';
  const submit = $('#auth-form button[type="submit"]');
  submit.disabled = true;
  try {
    const result = await api(`/api/auth/${mode}`, { method: 'POST', body: JSON.stringify(payload) });
    user = result.user;
    token = result.token;
    sessionStorage.setItem('sora-token', token);
    refreshAccount();
    $('#auth-dialog').close();
    showToast(language === 'ar' ? `أهلاً بك، ${user.name}` : `Welcome, ${user.name}`);
  } catch (error) {
    $('#auth-message').textContent = error.message;
  } finally {
    submit.disabled = false;
  }
}

async function submitReview(event) {
  event.preventDefault();
  if (!user) {
    $('#detail-dialog').close();
    setAuthMode('login');
    $('#auth-dialog').showModal();
    return;
  }
  const form = new FormData(event.currentTarget);
  try {
    await api('/api/me/reviews', {
      method: 'POST',
      body: JSON.stringify({ slug: selectedItem.slug, rating: Number(form.get('rating')), comment: form.get('comment') })
    });
    showToast(t('reviewSaved'));
    openDetail(selectedItem.slug);
  } catch (error) { showToast(error.message); }
}

async function downloadItem(slug) {
  const item = catalog.find(entry => entry.slug === slug);
  if (!item) return;
  let sourceUrl = item.sourceUrl;
  if (user) {
    try {
      const result = await api('/api/me/downloads', { method: 'POST', body: JSON.stringify({ slug }) });
      sourceUrl = result.sourceUrl || sourceUrl;
    } catch (error) { showToast(error.message); return; }
  } else {
    showToast(t('signInFirst'));
    historyItems = [slug, ...historyItems.filter(savedSlug => savedSlug !== slug)].slice(0, 30);
    localStorage.setItem('sora-history', JSON.stringify(historyItems));
  }
  try {
    const url = new URL(sourceUrl);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid source');
    window.open(url.href, '_blank', 'noopener,noreferrer');
    showToast(t('sourceOpened'));
  } catch { showToast(t('genericError')); }
}

function openCart() {
  renderCart();
  $('#cart-dialog').showModal();
}

function bindEvents() {
  document.addEventListener('click', event => {
    const filter = event.target.closest('[data-filter]');
    if (filter) {
      activeType = filter.dataset.filter;
      activeGenre = '';
      $$('.segment').forEach(button => button.classList.toggle('active', button.dataset.filter === activeType));
      renderCatalog();
      return;
    }
    const genre = event.target.closest('[data-genre]');
    if (genre) {
      activeGenre = activeGenre === genre.dataset.genre ? '' : genre.dataset.genre;
      renderCatalog();
      return;
    }
    const saved = event.target.closest('[data-save]');
    if (saved) {
      event.stopPropagation();
      toggleSaved(saved.dataset.save);
      return;
    }
    const remove = event.target.closest('[data-remove]');
    if (remove) { toggleSaved(remove.dataset.remove); return; }
    const download = event.target.closest('[data-download]');
    if (download) { downloadItem(download.dataset.download); return; }
    const open = event.target.closest('[data-open]');
    if (open) {
      event.preventDefault();
      openDetail(open.dataset.open);
      return;
    }
    const close = event.target.closest('[data-close]');
    if (close) { close.closest('dialog').close(); return; }
    const mode = event.target.closest('[data-auth-mode]');
    if (mode) { setAuthMode(mode.dataset.authMode); return; }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'account') handleAccount();
    if (action === 'explore') $('#discover').scrollIntoView({ behavior: 'smooth' });
    if (action === 'clearFilters') {
      activeType = 'all'; activeGenre = ''; searchTerm = '';
      $('#search').value = '';
      $$('.segment').forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
      renderCatalog();
    }
    const nav = event.target.closest('[data-view]');
    if (nav) setView(nav.dataset.view);
  });

  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      $('#search').focus();
    }
    if (event.key === 'Enter' && event.target.matches('.story-card')) openDetail(event.target.dataset.open);
  });
  $('#search').addEventListener('input', event => { searchTerm = event.target.value.trim(); renderCatalog(); });
  $('#sort').addEventListener('change', event => { sortBy = event.target.value; renderCatalog(); });
  $('.theme-toggle').addEventListener('click', () => setTheme(theme === 'dark' ? 'light' : 'dark'));
  $('.language-toggle').addEventListener('click', () => setLanguage(language === 'en' ? 'ar' : 'en'));
  $('.cart-toggle').addEventListener('click', openCart);
  $('#auth-form').addEventListener('submit', submitAuth);
  $('#profile-form').addEventListener('submit', submitProfile);
  $('#profile-logout').addEventListener('click', () => {
    token = '';
    user = null;
    sessionStorage.removeItem('sora-token');
    $('#profile-dialog').close();
    refreshAccount();
    showToast(t('loggedOut'));
  });
  $('#profile-admin').addEventListener('click', async () => {
    try {
      const stats = await api('/api/admin/stats');
      $('#admin-stats').innerHTML = Object.entries(stats).map(([key, value]) => `<div class="stat-card"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(t(key) || key)}</span></div>`).join('');
      $('#profile-dialog').close();
      $('#admin-dialog').showModal();
    } catch (error) { showToast(error.message); }
  });
  $$('.dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  }));
}

async function initialize() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  setTheme(theme);
  bindEvents();
  setLanguage(language);
  refreshAccount();
  renderCart();
  renderCatalog();
  try {
    const result = await api('/api/catalog');
    if (Array.isArray(result.items) && result.items.length) {
      catalog.splice(0, catalog.length, ...result.items);
      renderCatalog();
    }
    if (token) {
      const profile = await api('/api/me');
      user = profile.user;
      refreshAccount();
    }
  } catch {
  }
}

initialize();
