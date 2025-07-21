import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

// Mock course data
const events = [
  { title: '數學 A 班', start: '2025-07-21T10:00:00', end: '2025-07-21T12:00:00' },
  { title: '物理實驗', start: '2025-07-22T14:00:00', end: '2025-07-22T16:00:00' },
  { title: '英文會話', start: '2025-07-24T19:00:00', end: '2025-07-24T20:30:00' },
];

const DashboardPage = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-brand-primary mb-6">課程行事曆</h1>
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
            eventColor="#4AB7E0" // Use brand-accent for events
            eventTextColor="#FFFFFF" // White text for events
            dayHeaderClassNames="bg-gray-50"
            viewClassNames="border rounded-lg"
        />
    </div>
  );
};

export default DashboardPage;
