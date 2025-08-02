import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import cloudflareService from '../services/cloudflareService';

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const scheduleData = await cloudflareService.getSchedule();
        
        // 轉換數據格式以適應 FullCalendar
        const calendarEvents = scheduleData.map(item => ({
          id: item.id,
          title: item.course_name,
          start: item.start_time,
          end: item.end_time,
          extendedProps: {
            courseId: item.course_id,
            studentId: item.student_id,
            status: item.status,
            room: item.room
          }
        }));
        
        setEvents(calendarEvents);
        setLoading(false);
      } catch (err) {
        setError('獲取課表數據失敗: ' + err.message);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-primary-blue-700 mb-6">課程行事曆</h1>
        <div className="text-center py-8">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-primary-blue-700 mb-6">課程行事曆</h1>
        <div className="text-center py-8 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-primary-blue-700 mb-6">課程行事曆</h1>
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            locale='zh-tw' // Set locale to Traditional Chinese
            buttonText={{
                today:    '今天',
                month:    '月',
                week:     '週',
                day:      '日',
            }}
            allDayText='全天'
            height="auto" // Adjust height to fit container
            eventColor="#3B82F6" // Use primary-blue-500 for events
            eventTextColor="#FFFFFF" // White text for events
            dayHeaderClassNames="bg-gray-50"
            viewClassNames="border rounded-lg"
        />
    </div>
  );
};

export default DashboardPage;
