//plotting data arrays
const example1 = [];
const example2 = [];
const example3 = [];


//display data arrays
const example1Data = [];
const example2Data = [];
const example3Data = [];


//recieve data from python and sends to data arrays
const source = new EventSource('/chart-data');
source.onmessage = function(event) {
    const sentData = JSON.parse(event.data);

    //send data to plotting arrays
    example1.push(sentData.example1);
    example2.push(sentData.example2);
    example3.push(sentData.example3);
    

    //send data to display arrays
    example1Data.push(sentData.example1);
    example2Data.push(sentData.example2);
    example3Data.push(sentData.example3);

};

//sets interval for display box
let intervalID;
function displayData() {
    intervalID = setInterval(dataPull, 1250);
};

//pulls last datapoint from array,makes it 3 significant figures, and sends to front-end
function dataPull() {
    document.getElementById('example1Data').innerHTML = Number.parseFloat(example1Data.splice(-1)[0]).toPrecision(3);
    document.getElementById('example2Data').innerHTML = Number.parseFloat(example2Data.splice(-1)[0]).toPrecision(3);
    document.getElementById('example3Data').innerHTML = Number.parseFloat(example3Data.splice(-1)[0]).toPrecision(3);
};

//run function
displayData();

//pulls time data and data from array to send to the plotting functions
function example1Refresh(chart) {
    chart.data.datasets[0].data.push({
        x: Date.now(),
        y: example1.splice(-1)[0]
    });
    chart.data.datasets[1].data.push({
        x: Date.now(),
        y: example2.splice(-1)[0]
    });
};

function example3Refresh(chart) {
    chart.data.datasets[0].data.push({
        x: Date.now(),
        y: example3.splice(-1)[0]
    });
};


//plotting functions using live chart.js    
var example1Config = {
    type: 'line',
    data: {
        datasets: [{
        label: 'example 1',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5,5],
        fill: false,
        data: [],
        },
        {
        label: 'example 2',
        backgroundColor: 'rgb(0,89,255)',
        borderColor: 'rgb(0,89,255)',
        fill: false,
        data: [],   
        }]
    },
    options: {
        responsive: true,
        spanGaps: true,
        maintainAspectRation: false, 
        elements: {
            point: {
                radius: 0
            }
        }, 
        scales: {
        x: {
            type: 'realtime',
            realtime: {
            duration: 60000,
            refresh: 1000,
            delay: 1000,
            onRefresh: example1Refresh 
            }
        },
        y: {
            title: {
            display: true,
            text: 'units'
            },
            ticks: {
                stepSize: 0.1
            }
        }
        },
        interaction: {
        intersect: false
        },
        plugins: {
        title: {
            display: false,
            text: 'Line chart (hotizontal scroll) sample'
        }
        }
    }
 };

var example3Config = {
    type: 'line',
    data: {
        datasets: [{
        label: 'example 3',
        backgroundColor: 'rgb(0,89,255)',
        borderColor: 'rgb(0,89,255)',
        fill: false,
        data: [],
        }]
    },
    options: {
        responsive: true,
        spanGaps: true,
        maintainAspectRation: false, 
        elements: {
            point: {
                radius: 0
            }
        }, 
        scales: {
        x: {
            type: 'realtime',
            realtime: {
            duration: 60000,
            refresh: 1000,
            delay: 1000,
            onRefresh: example3Refresh 
            }
        },
        y: {
            title: {
            display: true,
            text: 'units'
            },
            ticks: {
                stepSize: 0.1
            }
        }
        },
        interaction: {
        intersect: false
        },
        plugins: {
        title: {
            display: false,
            text: 'Line chart (hotizontal scroll) sample'
        }
        }
    }
 };


//send plots to front-end
window.onload = function() {
    var example1ctx = document.getElementById('example1Chart').getContext('2d');
    example1ctx.canvas.height = 115;
    window.cpFlowrateChart = new Chart(example1ctx, example1Config);

    var example3ctx = document.getElementById('example3Chart').getContext('2d');
    example3tctx.canvas.height = 115;
    window.pumpOutputChart = new Chart(example3ctx, example3Config);

}