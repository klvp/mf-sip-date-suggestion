async function fetchNAVData(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

async function getSIPDate(url) {
    let navData = await fetchNAVData(url);
    let dailyData = navData.data.map((entry) => ({ ...entry, day: entry.date.split("-")[0] }));

    let dayAverageNav = Array.from({ length: 31 }, (_, dayIndex) => dayIndex + 1)
        .map(day => {
            let dayData = dailyData.filter(nav => nav.date.startsWith(String(day).padStart(2, '0')));
            let totalNav = dayData.reduce((sum, currentNav) => sum + parseFloat(currentNav.nav), 0);
            return { averageNav: (totalNav / dayData.length), day };
        });

    return dayAverageNav.sort((a, b) => a.averageNav - b.averageNav);
}

const url = `https://api.mfapi.in/mf/${process.argv[2]}`;
getSIPDate(url)
    .then(sortedData => {
        console.log(sortedData.slice(0));
    })
    .catch(error => {
        console.error('Error fetching NAV data:', error);
    });
