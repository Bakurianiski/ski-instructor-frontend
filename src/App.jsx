import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, Clock, Loader2, AlertCircle, X } from 'lucide-react';
import { sessionAPI, bookingAPI } from './config/api';
import { useLanguage } from './LanguageContext';

export default function App() {
  const { language, changeLanguage, t } = useLanguage(); 
  const [activeTab, setActiveTab] = useState('home');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    students: 1,
    notes: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch sessions from API on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await sessionAPI.getAll();
      setSessions(response.data.data);
    } catch (err) {
      setError('გაკვეთილების ჩატვირთვა ვერ მოხერხდა. გთხოვთ განაახლოთ გვერდი.');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSession) return;

    setSubmitting(true);
    setError(null);

    try {
      const bookingData = {
        session: selectedSession._id,
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        date: bookingForm.date,
        students: parseInt(bookingForm.students),
        notes: bookingForm.notes,
        language: language  
        
      };

      await bookingAPI.create(bookingData);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reset form
      setBookingForm({
        name: '',
        email: '',
        phone: '',
        date: '',
        students: 1,
        notes: ''
      });
      setSelectedSession(null);

      // Hide modal after 4 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        setActiveTab('home');
      }, 4000);

    } catch (err) {
      setError(err.response?.data?.message || 'დაჯავშნა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.');
      console.error('Error creating booking:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white font-sans relative overflow-hidden">
      {/* Animated Snow Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-60"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: -10 + 'px',
              animation: `snowfall ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: Math.random() * 10 + 's'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 glass-effect border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slide-left">
              <div className="text-5xl">⛷️</div>
              <div>
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-200 via-white to-cyan-200 bg-clip-text text-transparent">
                  SKI INSTRUCTOR
                </h1>
                <p className="text-sm text-blue-300 font-semibold">Comprehensive Ski Training Programs</p>
              </div>
            </div>
            
  {/* Language Switcher */}
<div className="relative">
  <select
    value={language}
    onChange={(e) => changeLanguage(e.target.value)}
    className="bg-slate-800/50 border border-white/20 rounded-xl px-4 py-2 text-white font-semibold focus:border-cyan-500 focus:outline-none transition-all cursor-pointer hover:bg-slate-700/50"
  >
    <option value="ka">🇬🇪 ქართული</option>
    <option value="en">🇬🇧 English</option>
    <option value="ru">🇷🇺 Русский</option>
  </select>
</div>


            <nav className="hidden md:flex gap-8 animate-slide-right">
              {['home', 'sessions', 'bookings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-lg font-bold tracking-wide transition-all duration-300 ${
                    activeTab === tab
                      ? 'text-cyan-300 border-b-2 border-cyan-300'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                 {tab === 'home' ? t('home') : tab === 'sessions' ? t('sessions') : t('bookings')}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="relative z-10 max-w-6xl mx-auto px-6 mt-4">
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3 animate-fade-up">
            <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
            <p className="text-red-200">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6 animate-fade-up">
              <div className="text-8xl mb-4 animate-pulse-slow">🏔️</div>
<h2 className="text-6xl md:text-7xl font-black leading-tight bg-gradient-to-b from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
  {t('heroTitle')}<br />{t('heroTitle2')}
</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
  {t('heroDescription')}
</p>
              <button
                onClick={() => setActiveTab('sessions')}
                className="mt-8 px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xl font-black tracking-wide hover:scale-105 transition-transform duration-300 shadow-2xl mountain-shadow flex items-center gap-3 mx-auto"
              >
                {t('viewSessions')}
                <ChevronRight size={24} />
              </button>
            </section>

            {/* Features */}
            <section className="grid md:grid-cols-3 gap-8">
             {[
  { icon: '🎖️', title: t('certified'), desc: t('certifiedDesc') },
  { icon: '👥', title: t('individual'), desc: t('individualDesc') },
  { icon: '🏆', title: t('results'), desc: t('resultsDesc') }
].map((feature, index) => (
  
                <div
                  key={index}
                  className="glass-effect rounded-3xl p-8 text-center space-y-4 hover:scale-105 transition-all duration-300 mountain-shadow animate-fade-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-6xl">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-cyan-300">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-8">
         <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent animate-fade-up">
  {t('mySessions')}
</h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
                <Loader2 className="animate-spin text-cyan-400 mb-4" size={48} />
                <p className="text-gray-400 text-lg">{t('loading')}</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-20 animate-fade-up">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-400 text-xl">{t('noSessions')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {sessions.map((session, index) => (
                  <div
                    key={session._id}
                    className="glass-effect rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 mountain-shadow animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-center">
                      <div className="text-7xl mb-4">{session.image}</div>
                      <h3 className="text-2xl font-bold">{session.title?.[language] || session.title}</h3>
                    </div>
                    <div className="p-8 space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-cyan-300">
                        <Clock size={18} />
{session.duration?.[language] || session.duration}
                        </span>
         <span className="px-4 py-1 bg-blue-500/30 rounded-full text-xs font-bold">
  {session.level?.[language] || session.level}
</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{session.description?.[language] || session.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-3xl font-black text-cyan-300">{session.price}{session.currency}</span>
                        <button
                          onClick={() => {
                            setSelectedSession(session);
                            setActiveTab('bookings');
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full font-bold hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                        >
                          {t('book')}
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent animate-fade-up">
  {t('bookingTitle')}
</h2>

            {/* Booking Form */}
            <div className="glass-effect rounded-3xl p-8 mountain-shadow animate-fade-up">
              <form onSubmit={handleBooking} className="space-y-6">
                {/* Session Selection */}
                <div>
                  <label className="block text-lg font-bold mb-3 text-cyan-300">{t('selectSession')}*</label>
                  <select
                    value={selectedSession?._id || ''}
                    onChange={(e) => setSelectedSession(sessions.find(s => s._id === e.target.value))}
                    className="w-full px-6 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                    required
                  >
                    <option value="">  {t('selectSessionPlaceholder')}</option>
                    {sessions.map(session => (
        <option key={session._id} value={session._id}>
  {session.title?.[language] || session.title} - {session.price}{session.currency}
</option>
                    ))}
                  </select>
                </div>

                {selectedSession && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 space-y-2">
                  <p className="text-sm text-gray-300"><strong>{t('duration')}:</strong> {selectedSession.duration?.[language]}</p>
<p className="text-sm text-gray-300"><strong>{t('level')}:</strong> {selectedSession.level?.[language]}</p>
<p className="text-sm text-gray-300"><strong>{t('maxStudents')}:</strong> {selectedSession.maxStudents}</p>
<p className="text-sm text-gray-300"><strong>{t('price')}:</strong> {selectedSession.price}{selectedSession.currency} {t('perStudent')}</p>
                  </div>
                )}

                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold mb-3 text-cyan-300">{t('fullName')}*</label>
                    <input
                      type="text"
                      name="name"
                      value={bookingForm.name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                      placeholder={t('fullNamePlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold mb-3 text-cyan-300">{t('phone')} *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                       placeholder={t('phonePlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold mb-3 text-cyan-300">{t('email')}*</label>
                  <input
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                    placeholder={t('emailPlaceholder')}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold mb-3 text-cyan-300">{t('date')}*</label>
                    <input
                      type="date"
                      name="date"
                      value={bookingForm.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-6 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold mb-3 text-cyan-300">{t('studentsCount')} *</label>
                    <input
                      type="number"
                      name="students"
                      min="1"
                      max={selectedSession?.maxStudents || 10}
                      value={bookingForm.students}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold mb-3 text-cyan-300">{t('notes')}</label>
                  <textarea
                    name="notes"
                    value={bookingForm.notes}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-6 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:border-cyan-500 focus:outline-none transition-all resize-none"
                    placeholder={t('notesPlaceholder')}
                  ></textarea>
                </div>

                {selectedSession && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
                    <p className="text-green-300 font-bold text-lg">
                      {t('totalPrice')}: {selectedSession.price * bookingForm.students}{selectedSession.currency}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl text-xl font-black tracking-wide hover:scale-105 transition-transform duration-300 mountain-shadow flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                     {t('submitting')}
                    </>
                  ) : (
                    <>
                      <Check size={24} />
                      {t('confirmBooking')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-fade-up">
          <div className="glass-effect rounded-3xl p-12 max-w-md text-center mountain-shadow">
            <div className="text-7xl mb-6 animate-pulse-slow">✅</div>
         <h3 className="text-3xl font-black mb-4 text-cyan-300">{t('bookingSuccess')}</h3>
<p className="text-gray-300 text-lg mb-2">
  {t('thankYou')}
</p>
<p className="text-gray-400 text-sm">
  {t('willContact')}
</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/50 border-t border-white/10 mt-20 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Column 1: About */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="text-3xl">⛷️</div>
                <h3 className="text-xl font-black text-cyan-300">{t('footerTitle')}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('footerDescription')}
              </p>
            </div>

            {/* Column 2: Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cyan-300">{t('contactUs')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <span>📞</span>
                  <div>
                    <p className="font-semibold text-white">{t('phone')}</p>
                    <a href="tel:+995555123456" className="hover:text-cyan-300 transition">
                      +995 599 159 236
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>📧</span>
                  <div>
                    <p className="font-semibold text-white">{t('email')}</p>
                    <a href="mailto:chanturiasaba15@gmail.com" className="hover:text-cyan-300 transition break-all">
                      chanturiasaba15@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cyan-300">{t('address')}</h3>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <span className="text-lg">📍</span>
                <p>{t('addressText')}</p>
              </div>
            </div>

            {/* Column 4: Social */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cyan-300">{t('followUs')}</h3>
              <div className="flex gap-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <span className="text-xl">📘</span>
                </a>
                
                <a 
                  
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <span className="text-xl">📸</span>
                </a>

                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                  aria-label="YouTube"
                >
                  <span className="text-xl">📺</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Ski Instructor. {t('rightsReserved')}.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-white/10 z-50">
        <div className="flex justify-around py-4">
          {['home', 'sessions', 'bookings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeTab === tab ? 'text-cyan-300 scale-110' : 'text-gray-400'
              }`}
            >
              {tab === 'home' && '🏠'}
              {tab === 'sessions' && '⛷️'}
              {tab === 'bookings' && '📅'}
              <span className="text-xs font-bold">
               {tab === 'home' ? t('home') : tab === 'sessions' ? t('sessions') : t('bookings')}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
