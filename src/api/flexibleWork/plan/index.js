function getWorkPlan() {
    return new Promise(resolve => {
        const res = {
            success: true,
            response: planData,
            status: 200,
        };
        setTimeout(() => {
            resolve({ ...res });
        }, 1000);
    });
}

export { getWorkPlan };

const planData = {
    year: '2021',
    month: '12',
    week: '11.29~12.04',
    weekCnt: 1,
    defaultStartTime: '0900',
    defaultEndTime: '1800',
    dailyWorkTime: 8,
    flexibleWorkType: 'WEEK_52',
    mandatoryTimeList: [
        {
            startTime: '1000',
            endTime: '1200',
        },
    ],
    restTimeList: [
        {
            startTime: '1200',
            endTime: '1300',
        },
    ],
    planList: [
        {
            planDay: '11.29',
            dayOfWeek: '월',
            startTime: '1000',
            endTime: '1900',
            totalHour: 8,
        },
        {
            planDay: '11.30',
            dayOfWeek: '화',
            startTime: '0900',
            endTime: '1800',
            totalHour: 8,
        },
        {
            planDay: '12.01',
            dayOfWeek: '수',
            startTime: '0930',
            endTime: '1900',
            totalHour: 8.5,
        },
        {
            planDay: '12.02',
            dayOfWeek: '목',
            startTime: '1000',
            endTime: '1900',
            totalHour: 8,
        },
        {
            planDay: '12.03',
            dayOfWeek: '금',
            startTime: '1000',
            endTime: '1900',
            totalHour: 8,
        },
    ],
};
