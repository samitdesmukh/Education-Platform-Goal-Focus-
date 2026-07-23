import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import TutorAvatar from '../components/TutorAvatar';
import { getDashboardPath } from '../utils/auth';

export default function BookingFlow() {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('tutorId');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(preselectedId ? 2 : 1);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '', duration: '1', notes: '', paymentMethod: 'card' });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { num: 1, title: 'Select Teacher' },
    { num: 2, title: 'Choose Date & Time' },
    { num: 3, title: 'Trial Class' },
    { num: 4, title: 'Payment' },
    { num: 5, title: 'Confirmation' },
  ];

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await api.getAllTutors();
        if (res.success) {
          setTutors(res.data);
          if (preselectedId) {
            const tutor = res.data.find((t) => t.id === preselectedId);
            if (tutor) setSelectedTutor(tutor);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, [preselectedId]);

  const handleSelectTutor = (tutor) => {
    setSelectedTutor(tutor);
    setStep(2);
  };

  const trialPrice = selectedTutor
    ? ((selectedTutor.price * parseFloat(bookingData.duration || 1)) / 2).toFixed(2)
    : '0';

  const handleConfirmBooking = async () => {
    if (!selectedTutor || !bookingData.date || !bookingData.time) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const res = await api.createBooking({
        tutorId: selectedTutor.id,
        date: bookingData.date,
        time: bookingData.time,
        duration: bookingData.duration,
        notes: bookingData.notes,
        isTrial: true,
        paymentMethod: bookingData.paymentMethod,
      });
      if (res.success) {
        setBookingConfirmed(true);
        setStep(5);
        setError('');
      } else {
        setError(res.message || 'Failed to create booking');
      }
    } catch (err) {
      setError('Error creating booking');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Book Your Trial Lesson</h1>

        <div className="bg-white rounded-xl shadow-lg p-8 border mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                {idx < steps.length - 1 && <div className={`h-1 flex-1 mx-1 ${step > s.num ? 'bg-blue-600' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 text-sm">Step {step}: {steps[step - 1].title}</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        <div className="bg-white rounded-xl shadow-lg p-8 border">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Select a Verified Teacher</h2>
              {loading ? <p>Loading...</p> : tutors.length === 0 ? (
                <p className="text-gray-500">No approved teachers available yet.</p>
              ) : (
                <div className="space-y-4">
                  {tutors.map((tutor) => (
                    <div key={tutor.id} onClick={() => handleSelectTutor(tutor)} className="border-2 rounded-xl p-4 hover:border-blue-600 cursor-pointer flex gap-4">
                      <TutorAvatar tutor={tutor} size="md" />
                      <div className="flex-1">
                        <h3 className="font-bold">{tutor.name} {tutor.verified && <span className="text-green-600 text-xs">✓ Verified</span>}</h3>
                        <p className="text-gray-600 text-sm">{tutor.subject} · {tutor.country}</p>
                        <p className="text-yellow-600 text-sm">⭐ {tutor.rating} ({tutor.reviewCount} reviews)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">${tutor.price}</p>
                        <p className="text-xs text-gray-500">/hour</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && selectedTutor && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Schedule Your Class</h2>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center gap-4">
                <TutorAvatar tutor={selectedTutor} size="sm" />
                <div>
                  <p className="font-semibold">{selectedTutor.name}</p>
                  <p className="text-sm text-gray-600">${selectedTutor.price}/hour · 50% off trial</p>
                </div>
              </div>
              <div className="space-y-4">
                <input type="date" value={bookingData.date} min={new Date().toISOString().split('T')[0]} onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                <input type="time" value={bookingData.time} onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                <select value={bookingData.duration} onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="1">1 hour</option>
                  <option value="1.5">1.5 hours</option>
                  <option value="2">2 hours</option>
                </select>
              </div>
              <div className="flex gap-4 mt-8">
                {!preselectedId && <button onClick={() => setStep(1)} className="flex-1 py-3 border rounded-lg">Back</button>}
                <button onClick={() => setStep(3)} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Trial Class Info</h2>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                <p className="text-green-700 font-semibold">✓ First lesson with {selectedTutor?.name} — 50% off</p>
              </div>
              <textarea placeholder="Notes for the teacher..." value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })} className="w-full px-4 py-3 border rounded-lg" rows={4} />
              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border rounded-lg">Back</button>
                <button onClick={() => setStep(4)} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold">Next</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Payment</h2>
              <div className="p-4 bg-yellow-50 rounded-lg mb-4">
                <p className="text-2xl font-bold">Total: ${trialPrice}</p>
                <p className="text-sm text-gray-600">50% trial discount applied</p>
              </div>
              <div className="space-y-2 mb-6">
                {['card', 'upi', 'bank'].map((m) => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="payment" checked={bookingData.paymentMethod === m} onChange={() => setBookingData({ ...bookingData, paymentMethod: m })} />
                    <span className="capitalize">{m === 'card' ? '💳 Credit/Debit Card' : m === 'upi' ? '📱 UPI' : '🏦 Bank Transfer'}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(3)} className="flex-1 py-3 border rounded-lg">Back</button>
                <button onClick={handleConfirmBooking} className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold">Confirm & Pay</button>
              </div>
            </div>
          )}

          {step === 5 && bookingConfirmed && (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
              <div className="bg-green-50 rounded-lg p-6 mb-6 text-left">
                <p><strong>Teacher:</strong> {selectedTutor?.name}</p>
                <p><strong>Date:</strong> {bookingData.date}</p>
                <p><strong>Time:</strong> {bookingData.time}</p>
                <p><strong>Amount:</strong> ${trialPrice}</p>
              </div>
              <button onClick={() => navigate(getDashboardPath(user?.role))} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold">
                Go to Dashboard
              </button>
              <button onClick={() => navigate('/student/classes')} className="w-full py-3 mt-2 border border-blue-600 text-blue-600 rounded-lg font-bold">
                View My Calendar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
